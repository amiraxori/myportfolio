'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu} 
        className="p-2 -mr-2 text-neutral-800 dark:text-neutral-200 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-xl"
          >
            <nav className="flex flex-col p-6 space-y-6">
              <Link href="/#services" onClick={closeMenu} className="text-lg font-medium hover:text-neutral-500 transition-colors">Services</Link>
              <Link href="/#work" onClick={closeMenu} className="text-lg font-medium hover:text-neutral-500 transition-colors">Work</Link>
              <Link href="/blog" onClick={closeMenu} className="text-lg font-medium hover:text-neutral-500 transition-colors">Blog</Link>
              <Link href="/#process" onClick={closeMenu} className="text-lg font-medium hover:text-neutral-500 transition-colors">Process</Link>
              <Link href="/#contact" onClick={closeMenu} className="text-lg font-medium hover:text-neutral-500 transition-colors">Hire Me</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
