import { locales, localeInfo, localeFromSegment } from '../../lib/locales';
import { notFound } from 'next/navigation';
import { ClassicSite } from '../components/ClassicSite';
import { pageKeys, pageTitles } from '../../lib/content';
import { copy, translateText } from '../../lib/copy';
import { pagePath } from '../../lib/paths';
import { headerColor } from '../../lib/header-theme';
const route = (slug: string[] = []) => {
  const locale = localeFromSegment(slug[0]);
  return {
    locale,
    page: (locale !== 'en' ? slug.slice(1) : slug).join('/') || 'home',
  };
};
export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageKeys
      .filter((page) => locale !== 'en' || page !== 'home')
      .map((page) => ({
        slug: [
          ...(locale !== 'en' ? [locale] : []),
          ...(page === 'home' ? [] : [page]),
        ],
      })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const edition = 'classic';
  const { locale, page } = route(slug);
  return {
    title: `${translateText(pageTitles[page] || 'Vessyl', locale)} — Vessyl`,
    description: copy('homeShort', locale),
    alternates: {
      languages: Object.fromEntries(
        locales.map((option) => [
          localeInfo[option].tag,
          pagePath(edition, page, option),
        ]),
      ),
    },
  };
}
export async function generateViewport({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const edition = 'classic';
  return { themeColor: headerColor(edition, route(slug).page) };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { locale, page } = route(slug);
  if (!pageKeys.includes(page) || (locale === 'en' && slug.length !== 1))
    notFound();
  return <ClassicSite page={page} locale={locale} />;
}
