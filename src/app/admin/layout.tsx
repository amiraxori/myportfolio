'use client';

import Link from 'next/link';
import AdminMobileSidebar from '@/components/admin/AdminMobileSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/admin" className="font-bold tracking-tight">ADMIN PANEL</Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Dashboard</Link>
          <Link href="/admin/projects" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Projects</Link>
          <Link href="/admin/blog" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Blog</Link>
          <Link href="/admin/chat" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Chat</Link>
          <Link href="/admin/services" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Services</Link>
          <Link href="/admin/testimonials" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Testimonials</Link>
          <Link href="/admin/faqs" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">FAQs</Link>
          <Link href="/admin/leads" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Leads</Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link href="/" className="block px-4 py-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
            View Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            <AdminMobileSidebar />
            <h2 className="font-semibold hidden md:block">Control Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
    >
      Logout
    </button>
  );
}
