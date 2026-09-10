'use client';
import { useLocale } from './LocaleProvider';
import art from '../../lib/typography-art.json';
import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { asset } from '../../lib/paths';
const catalog = art as Record<
  string,
  {
    desktop: string;
    mobile: string;
    desktopWidth: number;
    desktopHeight: number;
    mobileWidth: number;
    mobileHeight: number;
    mobileFlow?: {
      file: string;
      size: number;
      lineHeight: number;
      spaceWidth: number;
      words: { width: number }[];
    };
    responsive?: Record<
      'small' | 'medium' | 'large',
      { file: string; width: number; height: number }
    >;
  }
>;
const FlowingHeadingsContext = createContext(false);
export function FluidHeadings({ children }: { children: ReactNode }) {
  return (
    <FlowingHeadingsContext.Provider value>
      {children}
    </FlowingHeadingsContext.Provider>
  );
}
export function Heading({
  text: sourceText,
  as = 'h2',
  light = false,
  weight,
  align,
  visualStyle,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'blockquote' | 'span';
  light?: boolean;
  weight?: 'regular' | 'bold';
  align?: 'center';
  visualStyle?: 'h2' | 'h3';
}) {
  const { t } = useLocale();
  const flowing = useContext(FlowingHeadingsContext);
  const text = t(sourceText);
  const style =
    visualStyle ?? (as === 'blockquote' ? 'quote' : as === 'span' ? 'h2' : as);
  const artworkFor = (artStyle: string) => {
    const variant =
      (artStyle === 'h1' && weight ? `-${weight}` : '') +
      (align === 'center' ? '-center' : '');
    let hash = 2166136261;
    for (const char of artStyle + variant + '|' + text)
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
    return catalog[hash.toString(16)];
  };
  // Regular H2/H3 word outlines have identical letterforms. Reuse the exact
  // approved copy's artwork when its visual role changes; CSS owns its size.
  const entry =
    artworkFor(style) ??
    (flowing && visualStyle && (as === 'h2' || as === 'h3')
      ? artworkFor(as)
      : undefined);
  const flow = flowing ? entry?.mobileFlow : undefined;
  const viewportFlow = Boolean(flow && style !== 'quote');
  const responsiveStyle = entry?.responsive
    ? ({
        '--heading-wide-image': `url("${asset('/typography/' + entry.desktop)}")`,
        '--heading-wide-ratio': `${entry.desktopWidth} / ${entry.desktopHeight}`,
        '--heading-wide-width': `${entry.desktopWidth}px`,
        ...Object.fromEntries(
          Object.entries(entry.responsive).flatMap(([size, variant]) => [
            [
              `--heading-${size}-image`,
              `url("${asset('/typography/' + variant.file)}")`,
            ],
            [`--heading-${size}-ratio`, `${variant.width} / ${variant.height}`],
            [`--heading-${size}-width`, `${variant.width}px`],
          ]),
        ),
      } as CSSProperties)
    : undefined;
  const Tag = as;
  return (
    <Tag
      className={`brand-heading brand-heading-${style} ${weight === 'regular' ? 'heading-regular' : ''} ${align === 'center' ? 'heading-centered' : ''} ${light ? 'heading-light' : ''} ${entry?.responsive && !viewportFlow ? 'heading-adaptive' : ''} ${flow ? 'heading-fluid-mobile' : ''} ${viewportFlow ? 'heading-fluid' : ''}`}
      data-heading={text}
      data-typography-role={style}
    >
      {entry ? (
        <>
          <span className="sr-only">{text}</span>
          {!viewportFlow && (
            <picture
              className={entry.responsive ? 'heading-fallback' : undefined}
            >
              <source
                media="(max-width: 560px)"
                width={entry.mobileWidth}
                height={entry.mobileHeight}
                srcSet={asset('/typography/' + entry.mobile)}
              />
              <img
                src={asset('/typography/' + entry.desktop)}
                width={entry.desktopWidth}
                height={entry.desktopHeight}
                alt=""
                decoding="async"
                loading={entry.responsive ? 'lazy' : undefined}
              />
            </picture>
          )}
          {!viewportFlow && responsiveStyle && (
            <span
              aria-hidden="true"
              className="heading-responsive-art"
              style={responsiveStyle}
            />
          )}
          {flow && (
            <span
              className="heading-mobile-flow"
              aria-hidden="true"
              style={
                {
                  '--heading-word-space': `${flow.spaceWidth}px`,
                  '--heading-word-space-em': flow.spaceWidth / flow.size,
                } as CSSProperties
              }
              data-type-size={flow.size}
            >
              {flow.words.map((word, index) => (
                <svg
                  key={index}
                  width={word.width}
                  height={flow.lineHeight}
                  viewBox={`0 0 ${word.width} ${flow.lineHeight}`}
                  focusable="false"
                  aria-hidden="true"
                  style={
                    {
                      '--heading-word-width-em': word.width / flow.size,
                    } as CSSProperties
                  }
                >
                  <use
                    href={`${asset('/typography/' + flow.file)}#word-${index}`}
                  />
                </svg>
              ))}
            </span>
          )}
        </>
      ) : (
        text
      )}
    </Tag>
  );
}
