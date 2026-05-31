import Faq from '@/models/Faq';
import { tryDbConnect } from '@/lib/db';
import { Reveal } from '@/components/motion/Reveal';

export default async function FaqSection() {
  const db = await tryDbConnect();

  if (!db) return null;

  const faqs = await Faq.find({}).sort({ order: 1 }).lean();

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-14 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-6 max-w-3xl flex flex-col items-center">
        <Reveal>
          <h2 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        </Reveal>
        <div className="space-y-6 w-full">
          {faqs.map((faq, index) => (
            <Reveal key={faq._id} delay={index * 0.1} width="100%">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
