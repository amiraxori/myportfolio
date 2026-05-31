import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-32 pb-24">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Message Received!</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12">
          Thank you for reaching out. I've received your inquiry and will review it shortly. You can expect a response within 24-48 hours.
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold transition-transform hover:scale-105 inline-block"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
