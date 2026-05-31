import Hero from '@/components/sections/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import WorkGrid from '@/components/sections/WorkGrid';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FaqSection from '@/components/sections/FaqSection';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import { Reveal } from '@/components/motion/Reveal';

const processSteps = [
  { step: '01', title: 'Discovery', desc: 'Understanding your goals and target audience.' },
  { step: '02', title: 'Strategy', desc: 'Planning the architecture and user experience.' },
  { step: '03', title: 'Execution', desc: 'Building with high-quality, maintainable code.' },
  { step: '04', title: 'Launch', desc: 'Optimizing and deploying to production.' },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />
      <WorkGrid />
      <TestimonialsSection />
      
      <section id="process" className="py-14">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl font-bold mb-10 text-center">Development Process</h2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.1}>
                <div className="relative p-6 border-l-2 border-neutral-200 dark:border-neutral-800 h-full">
                  <span className="text-4xl font-black text-neutral-100 dark:text-neutral-900 absolute top-0 left-6 -z-10">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section id="contact" className="py-14">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10 flex flex-col items-center">
            <Reveal>
              <h2 className="text-4xl font-bold mb-4">Let's Build Something Great</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-neutral-600 dark:text-neutral-400">Ready to start your next project? Get in touch today.</p>
            </Reveal>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
