'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, Zap, CheckCircle2, Clock, Tag } from 'lucide-react';

const STORAGE_KEY = 'promo_dismissed_at';
const DISMISS_DURATION_DAYS = 3;

const INCLUDED = [
  'Custom design & responsive layout',
  'Next.js + TypeScript stack',
  'SEO optimisation built-in',
  'Contact form & lead capture',
  'Free 30-day post-launch support',
];

export default function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const dismissedAt = parseInt(raw, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DURATION_DAYS) return;
    }
    // Delay so the page has time to settle
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28, delay: 0.05 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400" />

            {/* Close button */}
            <button
              onClick={dismiss}
              aria-label="Close promotion"
              className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide border border-blue-200 dark:border-blue-800"
              >
                <Zap size={12} className="fill-blue-500 text-blue-500" />
                Limited-time offer
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-1">
                  30% Off Web Development
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                  Get a high-performance website at a special rate — valid for new projects booked this month.
                </p>
              </motion.div>

              {/* Discount pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 22 }}
                className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white"
              >
                <Tag size={28} className="shrink-0" />
                <div>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Your savings</p>
                  <p className="text-2xl font-black">30% Discount</p>
                </div>
                <motion.span
                  animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
                  transition={{ delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
                  className="ml-auto text-3xl select-none"
                >
                  🎉
                </motion.span>
              </motion.div>

              {/* Inclusions */}
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
                }}
                className="space-y-2 mb-7"
              >
                {INCLUDED.map((item) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <CheckCircle2 size={15} className="text-blue-500 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>

              {/* Urgency note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-6 font-medium"
              >
                <Clock size={13} />
                Offer valid for new clients — book a discovery call to lock in the rate.
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-3"
              >
                <Link
                  href="/#contact"
                  onClick={dismiss}
                  className="w-full text-center py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm transition-colors"
                >
                  Claim My 30% Discount
                </Link>
                <button
                  onClick={dismiss}
                  className="w-full text-center py-2.5 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
