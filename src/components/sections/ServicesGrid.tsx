import Service from '@/models/Service';
import { tryDbConnect } from '@/lib/db';
import { Reveal } from '@/components/motion/Reveal';

export default async function ServicesGrid() {
  const db = await tryDbConnect();

  if (!db) {
    return (
      <section id="services" className="py-14 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-6">
          <div className="mb-10 text-center flex flex-col items-center">
            <Reveal>
              <h2 className="text-4xl font-bold mb-4">Productized Services</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-neutral-600 dark:text-neutral-400">Fixed-scope, fixed-price packages designed to scale with your business.</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Reveal delay={0}>
              <ServiceCard
                name="Static Site"
                tagline="Fast, SEO-friendly marketing sites"
                price="10,000"
                deliverables={['5 Pages', 'Next.js + Tailwind', 'Basic SEO', 'Contact Form']}
                timeline="1-2 Weeks"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ServiceCard
                name="Dynamic + CMS"
                tagline="Full control over your content"
                price="25,000"
                deliverables={['Unlimited Content', 'Admin Dashboard', 'Cloudinary Integration', 'Blog Support']}
                timeline="3-4 Weeks"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <ServiceCard
                name="E-commerce"
                tagline="Scalable online storefronts"
                price="450,000"
                deliverables={['Custom Shopping Cart', 'Admin Dashboard', 'Product Management', 'High Performance']}
                timeline="8-12 Weeks"
              />
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  const services = await Service.find({}).sort({ order: 1 }).lean();

  return (
    <section id="services" className="py-14 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center flex flex-col items-center">
          <Reveal>
            <h2 className="text-4xl font-bold mb-4">Productized Services</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-neutral-600 dark:text-neutral-400">Fixed-scope, fixed-price packages designed to scale with your business.</p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.length === 0 ? (
            // Fallback to default tiers if DB is empty
            <>
              <Reveal delay={0}>
                <ServiceCard
                  name="Static Site"
                  tagline="Fast, SEO-friendly marketing sites"
                  price="10,000"
                  deliverables={['5 Pages', 'Next.js + Tailwind', 'Basic SEO', 'Contact Form']}
                  timeline="1-2 Weeks"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <ServiceCard
                  name="Dynamic + CMS"
                  tagline="Full control over your content"
                  price="25,000"
                  deliverables={['Unlimited Content', 'Admin Dashboard', 'Cloudinary Integration', 'Blog Support']}
                  timeline="3-4 Weeks"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <ServiceCard
                  name="E-commerce"
                  tagline="Scalable online storefronts"
                  price="450,000"
                  deliverables={['Custom Shopping Cart', 'Admin Dashboard', 'Product Management', 'High Performance']}
                  timeline="8-12 Weeks"
                />
              </Reveal>
            </>
          ) : (
            services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.1}>
                <ServiceCard
                  name={service.name}
                  tagline={service.tagline}
                  price={service.startingPrice.toLocaleString()}
                  deliverables={service.deliverables}
                  timeline={service.timeline}
                />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  name: string;
  tagline: string;
  price: string;
  deliverables: string[];
  timeline: string;
}

function ServiceCard({ name, tagline, price, deliverables, timeline }: ServiceCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex flex-col transition-all hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4 min-h-[3rem]">{tagline}</p>
      
      <div className="mb-5">
        <span className="text-sm font-semibold text-neutral-500 uppercase">Starts at</span>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">NPR {price}</span>
        </div>
      </div>

      <div className="flex-grow">
        <ul className="space-y-2 mb-5">
          {deliverables.map((item: string, i: number) => (
            <li key={i} className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-neutral-500 mb-6">Timeline: {timeline}</div>

      <a
        href="#contact"
        className="block text-center py-3 bg-blue-600 text-white dark:bg-blue-500 dark:text-white rounded-lg font-medium transition-all hover:bg-blue-700 dark:hover:bg-blue-400"
      >
        Choose Tier
      </a>
    </div>
  );
}
