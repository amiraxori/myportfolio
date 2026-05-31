import { MetadataRoute } from 'next';
import { tryDbConnect } from '@/lib/db';
import Project from '@/models/Project';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amirshrestha.com.np';

  const db = await tryDbConnect();
  const projects = db ? await Project.find({}).select('slug updatedAt') : [];

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}
