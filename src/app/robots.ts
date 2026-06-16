import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/auth', '/(studio)'],
      },
    ],
    sitemap: 'https://www.amitampocomeexplicaron.com/sitemap.xml',
  };
}
