import { readFile, readdir, writeFile, cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(
  /^\/+|\/+$/g,
  '',
);
// The root layout is shared by the export. Mark each localized document before
// publishing so its language is correct even without client-side JavaScript.
{
  for (const [locale, tag] of [
    ['es-LA', 'es-419'],
    ['zh-Hans', 'zh-Hans'],
  ]) {
    const localizedRoot = path.join('dist/client', base, locale);
    for (const name of await readdir(localizedRoot, { recursive: true })) {
      if (!name.endsWith('.html')) continue;
      const file = path.join(localizedRoot, name);
      const html = await readFile(file, 'utf8');
      await writeFile(
        file,
        html.replace('<html lang="en"', `<html lang="${tag}"`),
      );
    }
  }
}
if (base) {
  // Vinext puts the base-prefixed site in a nested directory; GitHub Pages mounts
  // the artifact at that prefix, so its deployable root must be the inner site.
  const source = path.join('dist/client', base);
  await rm('outputs/github-pages', { recursive: true, force: true });
  await mkdir('outputs/github-pages', { recursive: true });
  await cp(source, 'outputs/github-pages', { recursive: true });
  await cp('dist/client/404.html', 'outputs/github-pages/404.html');
  await writeFile('outputs/github-pages/.nojekyll', '');
  console.log('GitHub Pages artifact: outputs/github-pages');
} else await writeFile('dist/client/.nojekyll', '');
