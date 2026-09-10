'use client';
import { Popover } from '@base-ui/react/popover';
import { useEffect, useState } from 'react';
import { Globe2, ChevronDown, Check } from 'lucide-react';
import { useLocale } from './LocaleProvider';
import { pagePath } from '../../lib/paths';
import { locales, localeInfo } from '../../lib/locales';

export function LanguageSelector({
  edition,
  page,
  mobile = false,
}: {
  edition: string;
  page: string;
  mobile?: boolean;
}) {
  const { locale, c } = useLocale();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('bp:close-navigation', close);
    return () => window.removeEventListener('bp:close-navigation', close);
  }, []);
  return (
    <div
      className={`language-selector${mobile ? ' language-selector-mobile' : ''}`}
    >
      {mobile && <span className="language-label">{c('ui.language')}</span>}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className="language-trigger"
          aria-label={`${c('ui.chooseLanguage')}: ${localeInfo[locale].name}`}
        >
          <Globe2 size={19} strokeWidth={1.5} aria-hidden="true" />
          <span>{localeInfo[locale].short}</span>
          <ChevronDown
            className="language-chevron"
            size={12}
            aria-hidden="true"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="end"
            sideOffset={10}
            className="language-positioner"
          >
            <Popover.Popup
              className="language-popover"
              aria-label={c('ui.language')}
              lang={localeInfo[locale].tag}
            >
              {locales.map((option) => (
                <a
                  key={option}
                  href={pagePath(edition, page, option)}
                  hrefLang={localeInfo[option].tag}
                  lang={localeInfo[option].tag}
                  aria-current={locale === option ? 'true' : undefined}
                >
                  <span>{localeInfo[option].name}</span>
                  {locale === option && (
                    <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </a>
              ))}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
