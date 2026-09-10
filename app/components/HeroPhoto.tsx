import type { CSSProperties } from 'react';
import dimensions from '../../lib/image-dimensions.json';
import { Photo } from './Photo';

const framing: Record<string, { zoom: number; y: number }> = {
  stay: { zoom: 0.92, y: 0.4 },
  quantum: { zoom: 0.62, y: 0 },
  wellness: { zoom: 0.8, y: 0.15 },
  facilitators: { zoom: 0.92, y: 0.32 },
};

/** Keep the original photograph and hero height while widening the visible shot.
 * A defocused copy fills only the space beyond the source image's boundaries. */
export function HeroPhoto({
  page,
  id,
  alt,
}: {
  page: string;
  id: string;
  alt: string;
}) {
  const frame = framing[page];
  if (!frame)
    return (
      <Photo
        id={id}
        eager
        className="hero-photo"
        alt={alt}
        sizes={
          page === 'sessions' ? '(max-width: 820px) 1600px, 100vw' : undefined
        }
      />
    );
  const size = dimensions[id as keyof typeof dimensions];
  return (
    <div
      className="hero-photo hero-framing"
      style={
        {
          '--hero-zoom': frame.zoom,
          '--hero-photo-ratio': size.width / size.height,
          '--hero-photo-y': frame.y,
        } as CSSProperties
      }
    >
      <Photo id={id} eager alt="" className="hero-framing-fill" />
      <Photo id={id} eager alt={alt} className="hero-framing-source" />
    </div>
  );
}
