import { notFound } from 'next/navigation';
import { ClassicSite } from '../components/ClassicSite';
import { pageKeys, pageTitles } from '../../lib/content';
import { copy, translateText, type Locale } from '../../lib/copy';
import { pagePath } from '../../lib/paths';
import { headerColor } from '../../lib/header-theme';
const route = (slug: string[] = []) => {
  const locale: Locale = slug[0] === 'es-LA' ? 'es-LA' : 'en';
  return {
    locale,
    page: (locale === 'es-LA' ? slug.slice(1) : slug).join('/') || 'home',
  };
};
export async function generateStaticParams() {
  return (['en', 'es-LA'] as Locale[]).flatMap((locale) =>
    pageKeys
      .filter((page) => locale !== 'en' || page !== 'home')
      .map((page) => ({
        slug: [
          ...(locale === 'es-LA' ? ['es-LA'] : []),
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
      languages: {
        en: pagePath(edition, page),
        'es-419': pagePath(edition, page, 'es-LA'),
      },
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
  if (!pageKeys.includes(page) || (slug[0] !== 'es-LA' && slug.length !== 1))
    notFound();
  return <ClassicSite page={page} locale={locale} />;
}
