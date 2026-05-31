import Project from '@/models/Project';
import { tryDbConnect } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';

export default async function WorkGrid() {
  const db = await tryDbConnect();

  if (!db) return null;

  const projects = await Project.find({ featured: true }).sort({ order: 1 }).lean();

  if (projects.length === 0) return null;

  return (
    <section id="work" className="py-14">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <Reveal>
              <h2 className="text-4xl font-bold mb-4">Featured Work</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-neutral-600 dark:text-neutral-400">Selected projects demonstrating technical expertise and business impact.</p>
            </Reveal>
          </div>
        </div>

          <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.1} width="100%">
              <Link href={`/work/${project.slug}`} className="group block h-full">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-4">
                  <Image
                    src={project.coverImage.url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">{project.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
