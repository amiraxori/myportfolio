'use client';

import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isDetailsSet, setIsDetailsSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create sessionId
    let id = localStorage.getItem('chat_session_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chat_session_id', id);
    }
    setSessionId(id);

    const savedName = localStorage.getItem('chat_visitor_name');
    const savedEmail = localStorage.getItem('chat_visitor_email');
    if (savedName) setVisitorName(savedName);
    if (savedEmail) setVisitorEmail(savedEmail);
    if (savedName && savedEmail) setIsDetailsSet(true);

    console.log(`ChatWidget mounted. sessionId: ${id}`);

    // Fetch existing messages
    fetch(`/api/chat/messages?sessionId=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(`Fetched ${data.length} messages for session ${id}`);
        if (Array.isArray(data)) setMessages(data);
      });

    // Pusher subscription
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.error('Pusher environment variables are missing');
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${id}`);
    console.log(`Subscribed to chat-${id}`);

    const handleMessage = (newMessage: any) => {
      console.log('Received message via Pusher:', newMessage);
      setMessages(prev => {
        const exists = prev.some(m => String(m._id) === String(newMessage._id));
        if (exists) {
          console.log('ChatWidget: Message already exists in state, skipping update');
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    channel.bind('message', handleMessage);

    return () => {
      console.log(`Unsubscribing from chat-${id}`);
      channel.unbind('message', handleMessage);
      pusher.unsubscribe(`chat-${id}`);
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const content = input;
    setInput('');

    // Optimistically add message
    const tempMessage = {
      _id: 'temp-' + Date.now(),
      sessionId,
      sender: 'visitor',
      content,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content,
          visitorName: isDetailsSet ? visitorName : undefined,
          visitorEmail: isDetailsSet ? visitorEmail : undefined,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => {
          // Check if Pusher already added this message
          const exists = prev.some(m => String(m._id) === String(newMessage._id));
          if (exists) {
            console.log('ChatWidget: Message already exists from Pusher, removing temp');
            return prev.filter(m => String(m._id) !== String(tempMessage._id));
          }
          // Replace the temp message with the real one
          console.log('Message sent successfully, updating local state');
          return prev.map(m => String(m._id) === String(tempMessage._id) ? newMessage : m);
        });
      } else {
        console.error('Failed to send message:', await res.text());
        // Remove temp message on failure
        setMessages(prev => prev.filter(m => String(m._id) !== String(tempMessage._id)));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName.trim() && visitorEmail.trim()) {
      localStorage.setItem('chat_visitor_name', visitorName);
      localStorage.setItem('chat_visitor_email', visitorEmail);
      setIsDetailsSet(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 dark:bg-blue-500 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold tracking-tight">Chat with Amir</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {!isDetailsSet ? (
                <form onSubmit={saveDetails} className="space-y-4 h-full flex flex-col justify-center text-center p-4">
                  <div className="mb-2">
                    <User className="mx-auto text-neutral-400" size={48} />
                    <h3 className="text-lg font-bold mt-2">Welcome!</h3>
                    <p className="text-sm text-neutral-500">Please introduce yourself to start chatting.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <button type="submit" className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-bold">
                    Start Chat
                  </button>
                </form>
              ) : (
                <>
                  <div className="text-center text-xs text-neutral-400 mb-4">
                    This chat is persistent. I'll get back to you soon!
                  </div>
                  {messages.map((msg, i) => {
                    const key = msg._id || `msg-${i}-${msg.createdAt}`;
                    return (
                      <div key={key} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'visitor' 
                            ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-tr-none' 
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Footer */}
            {isDetailsSet && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow p-2 bg-transparent outline-none text-sm"
                />
                <button type="submit" disabled={!input.trim()} className="text-blue-600 dark:text-blue-400 disabled:opacity-30">
                  <Send size={20} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
