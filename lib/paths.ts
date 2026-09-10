import type { Locale } from './locales';
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(
  /\/$/,
  '',
);
export const asset = (path: string) => `${basePath}${path}`;
export const pagePath = (
  _edition: string,
  page = 'home',
  locale: Locale = 'en',
) =>
  `${basePath}/${locale === 'en' ? '' : locale + '/'}${page === 'home' ? '' : page + '/'}`;
