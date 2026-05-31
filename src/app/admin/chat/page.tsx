'use client';

import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Send, User, Search, Archive, MessageSquare } from 'lucide-react';

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedSessionIdRef = useRef(selectedSessionId);
  useEffect(() => {
    selectedSessionIdRef.current = selectedSessionId;
  }, [selectedSessionId]);

  useEffect(() => {
    fetchSessions();

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error('Pusher environment variables are missing');
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('admin-chat');
    
    const handleNewMessage = (data: any) => {
      console.log('Admin received new-message via Pusher:', data);
      
      // Strict deduplication: check if message ID already exists in messages state
      // but only if it's for the currently selected session
      if (selectedSessionIdRef.current === data.session.sessionId) {
        setMessages(prev => {
          const exists = prev.some(m => String(m._id) === String(data.message._id));
          if (exists) {
            console.log('Admin: Message already exists in state, skipping update');
            return prev;
          }
          return [...prev, data.message];
        });
        markAsRead(data.session.sessionId);
      }

      setSessions(prev => {
        const index = prev.findIndex(s => s.sessionId === data.session.sessionId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = data.session;
          // Move to top
          const [moved] = updated.splice(index, 1);
          return [moved, ...updated];
        }
        return [data.session, ...prev];
      });
    };

    channel.bind('new-message', handleNewMessage);

    return () => {
      channel.unbind('new-message', handleNewMessage);
      pusher.unsubscribe('admin-chat');
      pusher.disconnect();
    };
  }, []); // Run once on mount

  // Second effect to handle message updates for the selected session
  useEffect(() => {
    if (!selectedSessionId) return;

    fetchMessages(selectedSessionId);
    markAsRead(selectedSessionId);

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${selectedSessionId}`);
    console.log(`Admin subscribed to chat-${selectedSessionId}`);
    
    const handleMessage = (msg: any) => {
      console.log('Admin received message via Pusher:', msg);
      setMessages(prev => {
        const exists = prev.some(m => String(m._id) === String(msg._id));
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    channel.bind('message', handleMessage);

    return () => {
      console.log(`Admin unsubscribing from chat-${selectedSessionId}`);
      channel.unbind('message', handleMessage);
      pusher.unsubscribe(`chat-${selectedSessionId}`);
      pusher.disconnect();
    };
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const markAsRead = async (sessionId: string) => {
    try {
      await fetch('/api/admin/chat/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, unreadCount: 0 }),
      });
      setSessions(prev => prev.map(s => s.sessionId === sessionId ? { ...s, unreadCount: 0 } : s));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedSessionId) return;

    const content = input;
    setInput('');

    const tempMessage = {
      _id: 'temp-' + Date.now(),
      sessionId: selectedSessionId,
      sender: 'admin',
      content,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/admin/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSessionId, content }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        console.log('Admin message sent successfully:', newMessage._id);
        setMessages(prev => {
          // Check if Pusher already added this message
          const exists = prev.some(m => String(m._id) === String(newMessage._id));
          if (exists) {
            // Remove the temp message but don't add newMessage since it's already there
            return prev.filter(m => String(m._id) !== String(tempMessage._id));
          }
          // Otherwise replace temp with real
          return prev.map(m => String(m._id) === String(tempMessage._id) ? newMessage : m);
        });
      } else {
        console.error('Admin failed to send message:', await res.text());
        setMessages(prev => prev.filter(m => String(m._id) !== String(tempMessage._id)));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const selectedSession = sessions.find(s => s.sessionId === selectedSessionId);

  if (loading) return <div className="p-8 text-center text-neutral-500">Loading chats...</div>;

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No conversations yet</div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.sessionId}
                onClick={() => setSelectedSessionId(session.sessionId)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800/50 ${
                  selectedSessionId === session.sessionId ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                }`}
              >
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center shrink-0">
                  <User size={20} className="text-neutral-500" />
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm truncate">
                      {session.visitorName || 'Anonymous Visitor'}
                    </span>
                    {session.unreadCount > 0 && (
                      <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{session.visitorEmail || 'No email'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {selectedSessionId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{selectedSession?.visitorName || 'Visitor'}</h3>
                  <p className="text-xs text-neutral-500">{selectedSession?.visitorEmail}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500">
                <Archive size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/20">
              {messages.map((msg, i) => {
                const key = msg._id || `msg-${i}-${msg.createdAt}`;
                return (
                  <div key={key} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'admin'
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none'
                        : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                      <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex gap-4">
              <input
                type="text"
                placeholder="Type your response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-black dark:bg-white text-white dark:text-black px-6 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                Send <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 space-y-4">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <MessageSquare size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Your Inbox</h3>
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
