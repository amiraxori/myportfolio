'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Reveal } from '@/components/motion/Reveal';

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-12 pb-8">
      <div className="container mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <Reveal>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                Amir Shrestha
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xl md:text-2xl mb-6 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto lg:mx-0">
                React-first Full Stack Developer specializing in MERN + TypeScript and Django expertise.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="#contact"
                  className="px-8 py-4 bg-blue-600 text-white dark:bg-blue-500 rounded-full font-medium transition-all hover:scale-105 hover:bg-blue-700"
                >
                  Request a Quote
                </Link>
                <Link
                  href="#work"
                  className="px-8 py-4 border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 rounded-full font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  View Work
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0, 0.71, 0.2, 1.01],
                scale: {
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  restDelta: 0.001
                }
              }}
              className="relative"
            >
              {/* Decorative background element */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-300 to-indigo-200 dark:from-blue-900 dark:to-indigo-950 rounded-3xl -z-10 blur-2xl opacity-60 animate-pulse" />
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-3xl overflow-hidden border-2 border-white dark:border-neutral-800 shadow-2xl">
                <Image
                  src="/profile.jpg"
                  alt="Amir Shrestha"
                  fill
                  priority
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 400px"
                  className="object-cover"
                />
              </div>
              
              {/* Subtle floating animation wrapper */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Available for work</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.12),transparent_70%)]" />
    </section>
  );
}
