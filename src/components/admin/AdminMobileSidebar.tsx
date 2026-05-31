'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function AdminMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu} 
        className="p-2 -ml-2 text-neutral-800 dark:text-neutral-200 focus:outline-none"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/admin" onClick={closeMenu} className="font-bold tracking-tight">ADMIN PANEL</Link>
          <button onClick={closeMenu} className="p-1 focus:outline-none">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Dashboard</Link>
          <Link href="/admin/projects" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Projects</Link>
          <Link href="/admin/services" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Services</Link>
          <Link href="/admin/testimonials" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Testimonials</Link>
          <Link href="/admin/faqs" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">FAQs</Link>
          <Link href="/admin/leads" onClick={closeMenu} className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Leads</Link>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link href="/" onClick={closeMenu} className="block px-4 py-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
            View Website
          </Link>
        </div>
      </aside>
    </div>
  );
}
