'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MessageCircle, PhoneCall } from 'lucide-react';

const CONTACT_NUMBERS = ['9861158271', '9803535786'];

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function Footer() {
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://www.facebook.com/amir2036', label: 'Facebook' },
    { icon: <GithubIcon />, href: 'https://github.com/amiryogi', label: 'GitHub' },
    { icon: <Mail size={20} />, href: 'mailto:amirsvi766@gmail.com', label: 'Email' },
  ];

  const handlePhoneClick = (number: string) => {
    setSelectedNumber(number);
  };

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter mb-4 block">
              AMIR.
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
              Full Stack Developer specializing in MERN + TypeScript and Django. 
              Building high-performance web applications with a focus on user experience.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-neutral-500">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#services" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/#work" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Work</Link></li>
              <li><Link href="/blog" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/#contact" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-neutral-500">Contact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Email</p>
                <a href="mailto:amirsvi766@gmail.com" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                  amirsvi766@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Phone</p>
                <div className="flex flex-col gap-1">
                  {CONTACT_NUMBERS.map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePhoneClick(num)}
                      className="text-left text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Phone size={14} />
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Amir Shrestha. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Contact Options Modal */}
      <AnimatePresence>
        {selectedNumber && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNumber(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-neutral-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-neutral-200 dark:border-neutral-800"
            >
              <h3 className="text-xl font-bold mb-1 text-center">Contact Amir</h3>
              <p className="text-neutral-500 text-center mb-6">{selectedNumber}</p>
              
              <div className="grid grid-cols-1 gap-3">
                <a
                  href={`tel:${selectedNumber}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneCall size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Call</div>
                    <div className="text-xs text-neutral-500">Standard voice call</div>
                  </div>
                </a>

                <a
                  href={`viber://add?number=${selectedNumber.replace(/^0/, '977')}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Viber</div>
                    <div className="text-xs text-neutral-500">Message or call on Viber</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${selectedNumber.startsWith('9') ? '977' + selectedNumber : selectedNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">WhatsApp</div>
                    <div className="text-xs text-neutral-500">Message on WhatsApp</div>
                  </div>
                </a>
              </div>

              <button
                onClick={() => setSelectedNumber(null)}
                className="w-full mt-6 py-3 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
