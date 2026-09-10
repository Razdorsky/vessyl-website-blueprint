import { locales, localeInfo } from '../lib/locales';
import { ClassicSite } from './components/ClassicSite';
import { pagePath } from '../lib/paths';
import { copy } from '../lib/copy';
import { headerColor } from '../lib/header-theme';
export const metadata = {
  title: `${copy('home')} — Vessyl`,
  alternates: {
    languages: Object.fromEntries(
      locales.map((locale) => [
        localeInfo[locale].tag,
        pagePath('classic', 'home', locale),
      ]),
    ),
  },
};
export const viewport = { themeColor: headerColor('classic', 'home') };
export default function Page() {
  return <ClassicSite page="home" />;
}
