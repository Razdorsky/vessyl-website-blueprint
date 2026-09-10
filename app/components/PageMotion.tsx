'use client';
import { useEffect } from 'react';
import { basePath } from '../../lib/paths';
import { pageKeys } from '../../lib/content';
import { locales } from '../../lib/locales';

type WarmPage = {
  controller: AbortController;
  images: HTMLImageElement[];
  work: Promise<boolean>;
};

/** Warm only an intended destination; normal document navigation owns history. */
export function PageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const economical =
      connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
    const cache = new Map<string, WarmPage>();
    let active = 0;
    let hoverTimer = 0;
    let recoveryTimer = 0;
    let version = 0;
    let disposed = false;
    const delay = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const reset = () => {
      version++;
      clearTimeout(recoveryTimer);
      delete root.dataset.leaving;
      delete root.dataset.bpNavigating;
      delete root.dataset.bpHeroReady;
    };
    const internal = (target: EventTarget | null) => {
      const link = target instanceof Element ? target.closest('a[href]') : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.target ||
        link.hasAttribute('download') ||
        link.relList.contains('external')
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        !url.pathname.startsWith(basePath + '/')
      )
        return;
      if (url.pathname === location.pathname && url.search === location.search)
        return;
      const parts = url.pathname
        .slice(basePath.length)
        .split('/')
        .filter(Boolean);
      if (locales.some((locale) => locale !== 'en' && locale === parts[0]))
        parts.shift();
      if (parts.length > 1 || !pageKeys.includes(parts[0] || 'home')) return;
      return url;
    };
    const warm = (url: URL, urgent = false): WarmPage | undefined => {
      const id = url.pathname + url.search;
      if (cache.has(id)) return cache.get(id);
      if (economical || (!urgent && (active >= 2 || cache.size >= 6))) return;
      if (cache.size >= 6) {
        const oldest = cache.keys().next().value!;
        cache.get(oldest)?.controller.abort();
        cache.delete(oldest);
      }
      const controller = new AbortController();
      const entry: WarmPage = {
        controller,
        images: [],
        work: Promise.resolve(false),
      };
      cache.set(id, entry);
      active++;
      const abortImages = () =>
        entry.images.forEach((image) => {
          image.srcset = '';
          image.removeAttribute('src');
        });
      controller.signal.addEventListener('abort', abortImages, { once: true });
      const timeout = window.setTimeout(() => controller.abort(), 4000);
      entry.work = (async () => {
        try {
          const response = await fetch(id, {
            signal: controller.signal,
            credentials: 'same-origin',
          });
          if (
            !response.ok ||
            !response.headers.get('content-type')?.includes('text/html')
          )
            return false;
          const html = await response.text();
          // An inert template avoids downloading unrelated galleries or running scripts.
          const section = html.match(
            /<section\b[^>]*class="[^"]*\bphoto-hero\b[^"]*"[^>]*>[\s\S]*?<\/section>/,
          )?.[0];
          if (!section || controller.signal.aborted) return false;
          const template = document.createElement('template');
          template.innerHTML = section;
          const sources = [...template.content.querySelectorAll('img')];
          const results = await Promise.all(
            sources.map(async (source) => {
              const image = new Image();
              entry.images.push(image);
              image.decoding = 'async';
              image.fetchPriority = urgent ? 'high' : 'low';
              image.sizes = source.getAttribute('sizes') || '100vw';
              image.srcset = source.getAttribute('srcset') || '';
              image.src = new URL(source.getAttribute('src') || '', url).href;
              await image.decode();
              return image.naturalWidth > 0;
            }),
          );
          return results.length > 0 && results.every(Boolean);
        } catch {
          return false;
        } finally {
          clearTimeout(timeout);
          controller.signal.removeEventListener('abort', abortImages);
          active--;
        }
      })();
      return entry;
    };
    const intent = (event: Event) => {
      const url = internal(event.target);
      if (!url || economical) return;
      clearTimeout(hoverTimer);
      if (event.type === 'pointerover') {
        hoverTimer = window.setTimeout(() => {
          warm(url);
        }, 90);
      } else warm(url);
    };
    const abandonHover = () => clearTimeout(hoverTimer);
    const leave = async (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const url = internal(event.target);
      if (!url || reduced.matches) {
        if (event.target instanceof Element && event.target.closest('a[href]'))
          reset();
        return;
      }
      event.preventDefault();
      const current = ++version;
      clearTimeout(hoverTimer);
      root.dataset.bpNavigating = 'true';
      window.dispatchEvent(new Event('bp:close-navigation'));
      const entry = warm(url, true);
      const ready = entry
        ? await Promise.race([entry.work, delay(220).then(() => false)])
        : false;
      if (disposed || current !== version) return;
      root.dataset.bpHeroReady = ready ? 'true' : 'false';
      // Let React remove menus and release their scroll lock before the snapshot.
      await Promise.race([
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
        delay(60),
      ]);
      if (disposed || current !== version) return;
      if (root.dataset.pageMotion !== 'native') {
        root.dataset.leaving = 'true';
        await delay(140);
      }
      if (disposed || current !== version) return;
      window.dispatchEvent(new CustomEvent('bp:depart', { detail: url.href }));
      recoveryTimer = window.setTimeout(reset, 1500);
      location.assign(url.href);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && root.dataset.bpNavigating) reset();
    };
    window.addEventListener('pageshow', reset);
    document.addEventListener('click', leave);
    document.addEventListener('pointerover', intent, { passive: true });
    document.addEventListener('pointerout', abandonHover, { passive: true });
    document.addEventListener('pointerdown', intent, { passive: true });
    document.addEventListener('focusin', intent);
    document.addEventListener('keydown', escape);
    return () => {
      disposed = true;
      reset();
      clearTimeout(hoverTimer);
      cache.forEach((entry) => entry.controller.abort());
      window.removeEventListener('pageshow', reset);
      document.removeEventListener('click', leave);
      document.removeEventListener('pointerover', intent);
      document.removeEventListener('pointerout', abandonHover);
      document.removeEventListener('pointerdown', intent);
      document.removeEventListener('focusin', intent);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  return null;
}
