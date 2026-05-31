import Testimonial from '@/models/Testimonial';
import { tryDbConnect } from '@/lib/db';
import { Reveal } from '@/components/motion/Reveal';
import Image from 'next/image';

export default async function TestimonialsSection() {
  const db = await tryDbConnect();

  if (!db) return null;

  const testimonials = await Testimonial.find({}).sort({ order: 1 });

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-14">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <Reveal>
            <h2 className="text-4xl font-bold mb-4 text-center">What Clients Say</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-neutral-600 dark:text-neutral-400 text-center">Hear from the people I've worked with.</p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial._id} delay={index * 0.1} width="100%">
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                  {testimonial.avatar?.url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={testimonial.avatar.url}
                        alt={testimonial.author}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-neutral-500">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{testimonial.author}</h3>
                    <p className="text-sm text-neutral-500">
                      {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-700'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                
                <p className="text-neutral-600 dark:text-neutral-400 italic flex-grow">
                  "{testimonial.quote}"
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
