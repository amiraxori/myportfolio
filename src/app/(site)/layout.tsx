import Link from 'next/link';
import MobileNav from '@/components/sections/MobileNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import ChatWidget from '@/components/ChatWidget';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-[#f0f4ff]/80 dark:bg-[#070d1f]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            AMIR.
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm font-medium hover:text-neutral-500 transition-colors">Services</Link>
            <Link href="/#work" className="text-sm font-medium hover:text-neutral-500 transition-colors">Work</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-neutral-500 transition-colors">Blog</Link>
            <Link href="/#process" className="text-sm font-medium hover:text-neutral-500 transition-colors">Process</Link>
            <Link href="/#contact" className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-bold transition-transform hover:scale-105">
              Hire Me
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNav />
          </div>
        </nav>
      </header>
      <div className="flex-grow pt-16">
        {children}
      </div>
      <ChatWidget />
    </div>
  );
}
