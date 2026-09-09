import { ClassicSite } from './components/ClassicSite';
import { pagePath } from '../lib/paths';
import { copy } from '../lib/copy';
import { headerColor } from '../lib/header-theme';
export const metadata = {
  title: `${copy('home')} — Vessyl`,
  alternates: {
    languages: {
      en: pagePath('classic'),
      'es-419': pagePath('classic', 'home', 'es-LA'),
    },
  },
};
export const viewport = { themeColor: headerColor('classic', 'home') };
export default function Page() {
  return <ClassicSite page="home" />;
}
