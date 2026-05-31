import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import Image from 'next/image';

export const revalidate = 3600;

async function getPost(slug: string) {
  await dbConnect();
  return BlogPost.findOne({ slug, isPublished: true }).lean();
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: any = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-24 max-w-4xl">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6">
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">{post.title}</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed italic border-l-4 border-neutral-200 dark:border-neutral-800 pl-6 mb-12">
          {post.summary}
        </p>
        {post.coverImage?.url && (
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 border border-neutral-200 dark:border-neutral-800">
            <Image 
              src={post.coverImage.url} 
              alt={post.title} 
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div 
        className="prose prose-neutral dark:prose-invert max-w-none prose-lg md:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-xs uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50 p-8 rounded-3xl">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Written by</p>
            <p className="font-bold text-lg">{post.author}</p>
          </div>
          <a 
            href="/blog" 
            className="text-sm font-bold border-b-2 border-black dark:border-white hover:opacity-70 transition-opacity"
          >
            Back to Blog
          </a>
        </div>
      </footer>
    </article>
  );
}
