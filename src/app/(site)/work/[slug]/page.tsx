import Project from '@/models/Project';
import { tryDbConnect } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await tryDbConnect();

  if (!db) {
    return (
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link href="/#work" className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8 block">
            ← Back to Work
          </Link>
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-10">
            <h1 className="text-3xl font-bold mb-4">Project details are temporarily unavailable</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              The portfolio data store could not be reached right now. Please try again later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const project = await Project.findOne({ slug }).lean();

  if (!project) notFound();

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link href="/#work" className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8 block">
          ← Back to Work
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-3xl">
          {project.summary}
        </p>

        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-16 bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={project.coverImage.url}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <div className="prose dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                {project.description}
              </div>
            </section>

            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-1 gap-8">
                  {project.gallery.map((img: { url: string; publicId: string }, i: number) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image 
                        src={img.url} 
                        alt={`${project.title} screenshot ${i+1}`} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 640px"
                        className="object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {(project.liveUrl || project.repoUrl) && (
              <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4">Links</h3>
                <div className="space-y-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-black text-white dark:bg-white dark:text-black text-center rounded-lg font-bold">
                      Visit Live Site
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-neutral-200 dark:border-neutral-700 text-center rounded-lg font-medium">
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
