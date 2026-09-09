'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { asset } from '../../lib/paths';

/** A photographic spatial composition using the original Figma Dome layers.
 * Progress belongs to this chapter, independent of page length and locale. */
export function DomeJourney({
  opening,
  technology,
  layer,
}: {
  opening: ReactNode;
  technology: ReactNode;
  layer: string;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const wide = matchMedia('(min-width: 1001px)');
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (document.hidden) return;
      const rect = section.getBoundingClientRect();
      const progress =
        motion.matches || !wide.matches
          ? 1
          : Math.max(
              0,
              Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)),
            );
      section.style.setProperty('--dome-progress', String(progress));
      section.style.setProperty(
        '--dome-shell-opacity',
        String(1 - Math.min(1, progress / 0.65)),
      );
      section.style.setProperty(
        '--dome-inside-opacity',
        String(Math.max(0, Math.min(1, (progress - 0.16) / 0.64))),
      );
      section.dataset.scenePhase =
        progress < 0.35 ? 'outside' : progress < 0.75 ? 'entering' : 'inside';
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const preference = () => {
      update();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(section);
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', preference);
    wide.addEventListener('change', preference);
    update();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', preference);
      wide.removeEventListener('change', preference);
    };
  }, []);
  return (
    <section className="bp-dome-journey" ref={root} data-layer={layer}>
      <div className="bp-dome-narrative">
        <div className="bp-dome-opening">{opening}</div>
        <div className="bp-dome-technology">{technology}</div>
      </div>
      <div className="bp-dome-stage" aria-hidden="true">
        <div className="bp-dome-light" />
        <img
          className="bp-dome-rings"
          src={asset('/brand/dome-echo.svg')}
          alt=""
          width="1440"
          height="810"
        />
        <img
          className="bp-dome-inside"
          src={asset('/cinematic/dome-inside.webp')}
          alt=""
          width="1060"
          height="1300"
          decoding="async"
        />
        <img
          className="bp-dome-shell"
          src={asset('/cinematic/dome-shell.webp')}
          alt=""
          width="1500"
          height="1165"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
