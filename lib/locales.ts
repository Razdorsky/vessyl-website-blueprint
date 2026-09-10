export const locales = ['en', 'es-LA', 'zh-Hans'] as const;
export type Locale = (typeof locales)[number];
export const localeInfo: Record<
  Locale,
  { tag: string; name: string; short: string }
> = {
  en: { tag: 'en', name: 'English', short: 'EN' },
  'es-LA': { tag: 'es-419', name: 'Español', short: 'ES' },
  'zh-Hans': { tag: 'zh-Hans', name: '简体中文', short: '简中' },
};
export const localeFromSegment = (segment?: string): Locale =>
  locales.find((locale) => locale === segment) ?? 'en';
