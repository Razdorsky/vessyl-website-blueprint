'use client';
import { useEffect } from 'react';

const HERO_PARALLAX_RATE = (0.04 * 4) / 3;
const HERO_PARALLAX_LIMIT = 32;

/** Progressive enhancement: complete static content is the initial state.
 * Observe semantic groups once; never obscure content reached with a keyboard. */
export function useBlueprintMotion(page: string, locale: string) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.classic');
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const wide = matchMedia('(min-width: 821px)');
    const targets = new Set<HTMLElement>();
    const seen = new WeakSet<HTMLElement>();
    let frame = 0;
    let heroVisible = true;
    const hero = root.querySelector<HTMLElement>(
      '.home-hero, .page-hero:not(.people-hero)',
    );
    const image = hero?.querySelector<HTMLElement>('.hero-photo');
    // Preserve Sessions' approved face-sensitive crop; other photo scenes work
    // at every viewport width without relying on reported CPU counts.
    const gentleScene = page !== 'sessions';
    const reveal = (node: HTMLElement, instant = false) => {
      if (instant) {
        node.style.setProperty('--bp-reveal-delay', '0ms');
        node.style.setProperty('--bp-reveal-duration', '0ms');
      }
      node.dataset.bpVisible = 'true';
      seen.add(node);
      observer?.unobserve(node);
    };
    const collect = () => {
      root.querySelectorAll<HTMLElement>('[data-bp-reveal]').forEach((node) => {
        if (targets.has(node)) return;
        targets.add(node);
        const rect = node.getBoundingClientRect();
        // Inactive filter panels remain visible in CSS and can reveal normally
        // when selected; do not queue entrances for hidden DOM.
        if (
          reduced.matches ||
          !rect.height ||
          rect.top < innerHeight ||
          seen.has(node)
        ) {
          reveal(node, true);
          return;
        }
        if (node.dataset.bpReveal === 'card') {
          const siblings = [...node.parentElement!.children];
          const index = siblings.indexOf(node);
          node.style.setProperty(
            '--bp-reveal-delay',
            `${(index % (wide.matches ? 2 : 1)) * 70}ms`,
          );
        }
        node.dataset.bpVisible = 'false';
        observer?.observe(node);
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px 64px 0px' },
    );
    collect();
    const mutations = new MutationObserver(collect);
    mutations.observe(root, { childList: true, subtree: true });
    const focused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-bp-reveal]');
      if (target) reveal(target, true);
    };
    const updateScene = () => {
      frame = 0;
      if (!hero || !image) return;
      const enabled = gentleScene && !reduced.matches && !document.hidden;
      image.dataset.bpScene = enabled ? 'true' : 'false';
      if (!enabled) {
        image.style.removeProperty('--bp-hero-offset');
        return;
      }
      const rect = hero.getBoundingClientRect();
      image.style.setProperty(
        '--bp-hero-offset',
        `${Math.max(0, Math.min(HERO_PARALLAX_LIMIT, -rect.top * HERO_PARALLAX_RATE))}px`,
      );
    };
    const scroll = () => {
      if (heroVisible && !frame && !document.hidden)
        frame = requestAnimationFrame(updateScene);
    };
    const observeHero = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) scroll();
    });
    if (hero) observeHero.observe(hero);
    const preference = () => {
      if (reduced.matches) targets.forEach((node) => reveal(node, true));
      updateScene();
    };
    reduced.addEventListener('change', preference);
    wide.addEventListener('change', preference);
    root.addEventListener('focusin', focused);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll, { passive: true });
    document.addEventListener('visibilitychange', preference);
    updateScene();
    return () => {
      observer?.disconnect();
      mutations.disconnect();
      observeHero.disconnect();
      cancelAnimationFrame(frame);
      reduced.removeEventListener('change', preference);
      wide.removeEventListener('change', preference);
      root.removeEventListener('focusin', focused);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      document.removeEventListener('visibilitychange', preference);
      targets.forEach((node) => {
        delete node.dataset.bpVisible;
        node.style.removeProperty('--bp-reveal-delay');
        node.style.removeProperty('--bp-reveal-duration');
      });
      if (image) {
        delete image.dataset.bpScene;
        image.style.removeProperty('--bp-hero-offset');
      }
    };
  }, [page, locale]);
}
