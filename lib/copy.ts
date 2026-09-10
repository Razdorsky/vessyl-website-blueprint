import entries from './approved-copy.json';
import spanish from './locales/es-LA.json';
import chinese from './locales/zh-Hans.json';
import type { Locale } from './locales';
export type { Locale } from './locales';
export type CopyKey = keyof typeof entries;
const translated: Record<Exclude<Locale, 'en'>, Record<CopyKey, string>> = {
  'es-LA': spanish,
  'zh-Hans': chinese,
};
export const copy = (key: CopyKey, locale: Locale = 'en') =>
  locale === 'en' ? entries[key].text : translated[locale][key];
const byEnglish = new Map(
  Object.entries(entries).map(([key, value]) => [value.text, key as CopyKey]),
);
export const translateText = (text: string, locale: Locale) => {
  const key = byEnglish.get(text);
  return key ? copy(key, locale) : text;
};
export { entries as copyEvidence };
