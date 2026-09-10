/* Runs before the first paint: React effects cannot catch a fresh pagereveal. */
(() => {
  const root = document.documentElement;
  const key = 'vessyl:page-transition';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const native = 'onpageswap' in window && 'onpagereveal' in window;
  root.dataset.pageMotion = native ? 'native' : 'fallback';
  const read = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      return value &&
        value.to === location.href &&
        Date.now() - value.at < 15000
        ? value
        : null;
    } catch {
      return null;
    }
  };
  let incoming = read();
  let photoEntrance;
  const clear = () => {
    photoEntrance?.cancel();
    photoEntrance = undefined;
    delete root.dataset.bpTransition;
    delete root.dataset.bpHeader;
    delete root.dataset.bpNavigating;
    delete root.dataset.bpHeroReady;
    delete root.dataset.leaving;
    delete root.dataset.bpFallbackEnter;
  };
  if (!native && incoming && !reduced.matches)
    root.dataset.bpFallbackEnter = 'true';
  const depart = (to, traversal = false) => {
    const hero = document.querySelector('.photo-hero');
    const rect = hero?.getBoundingClientRect();
    const header = document
      .querySelector('.site-header')
      ?.getBoundingClientRect();
    const simple = traversal || new URL(to).hash || reduced.matches;
    const scene = !simple && root.dataset.bpHeroReady === 'true';
    const visible =
      rect && rect.top > -innerHeight * 0.25 && rect.bottom > innerHeight * 0.4;
    const mode = scene ? (visible ? 'hero' : 'enter') : 'dissolve';
    root.dataset.bpTransition = mode === 'enter' ? 'depart' : mode;
    root.dataset.bpHeader =
      scene && header && header.top >= -1 ? 'shared' : 'none';
    try {
      sessionStorage.setItem(key, JSON.stringify({ to, at: Date.now(), mode }));
    } catch {
      /* Private browsing must still navigate normally. */
    }
  };
  window.addEventListener('bp:depart', (event) => depart(event.detail));
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    event.viewTransition.ready.catch(() => {});
    if (reduced.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    const to = event.activation?.entry.url;
    if (to) depart(to, event.activation.navigationType === 'traverse');
    event.viewTransition.finished.catch(() => {}).finally(clear);
  });
  window.addEventListener('pagereveal', (event) => {
    if (!event.viewTransition) return;
    event.viewTransition.ready.catch(() => {});
    if (reduced.matches) {
      event.viewTransition.skipTransition();
      clear();
      return;
    }
    // BFCache restores an existing document rather than executing this script.
    incoming = read() || incoming;
    const hero = document.querySelector('.photo-hero');
    const images = hero ? [...hero.querySelectorAll('img')] : [];
    const ready =
      images.length &&
      images.every((image) => image.complete && image.naturalWidth);
    const mode = incoming?.mode;
    const animatedHero =
      ready && (mode === 'hero' || mode === 'enter') && scrollY < 2;
    root.dataset.bpTransition = animatedHero ? 'hero' : 'dissolve';
    root.dataset.bpHeader = animatedHero ? 'shared' : 'none';
    event.viewTransition.ready
      .then(() => {
        if (!animatedHero || reduced.matches) return;
        const photo = hero.querySelector('.hero-photo');
        if (photo) {
          const tokens = getComputedStyle(root);
          const time = tokens.getPropertyValue('--bp-transition-scene').trim();
          const duration = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
          const scale = parseFloat(getComputedStyle(photo).scale) || 1;
          // Animate the live image inside a stationary full-bleed capture.
          // The existing parallax/Sessions crop stays part of its base framing.
          photoEntrance = photo.animate([{ scale: scale * 1.1 }, { scale }], {
            duration: Number.isFinite(duration) ? duration : 800,
            easing: tokens.getPropertyValue('--ease-dissolve').trim(),
          });
        }
      })
      .catch(() => {});
    incoming = null;
    event.viewTransition.finished.catch(() => {}).finally(clear);
  });
  window.addEventListener('pageshow', (event) => {
    delete root.dataset.bpNavigating;
    delete root.dataset.leaving;
    if (event.persisted) {
      window.dispatchEvent(new Event('bp:close-navigation'));
      incoming = read();
    }
  });
})();
