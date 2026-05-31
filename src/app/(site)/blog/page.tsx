import Link from 'next/link';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import Image from 'next/image';

export const revalidate = 3600; // revalidate every hour

async function getPosts() {
  await dbConnect();
  return BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 italic tracking-tight">BLOG.</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Sharing thoughts on technology, design, and building products.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(posts as any[]).map((post) => (
          <Link 
            key={post._id.toString()} 
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="h-full border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-black dark:hover:border-white transition-colors">
              {post.coverImage?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src={post.coverImage.url} 
                    alt={post.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:underline underline-offset-4">{post.title}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3">
                  {post.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500">No blog posts yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
