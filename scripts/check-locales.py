#!/usr/bin/env python3
"""Check source parity, facts, CJK glyph coverage and locale-preserving routes."""
import hashlib
import json
import os
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = json.loads((root / 'lib/approved-copy.json').read_text())
errors = []
locales = {'es-LA': 'es-419', 'zh-Hans': 'zh-Hans'}
# The Chinese editorial contract preserves these personal and brand names.
# Match Latin boundaries, including names immediately adjacent to Chinese text.
protected_names = [
    'Josh Stanley', 'Stanley', 'Enrique Molina', 'Oscar',
    'Devli Saul Mendoza', 'George Augspurger', 'Dara Kaplan',
    'Wunderlich Kaplan Communications', "Charlotte's Web",
    'AKEN Hotels & Resorts', 'Clark Synthesis', 'The Elumenati',
    'Panasonic REQ12', 'HydroChallenge', 'Sansa Airlines',
]

def check_names(original, translated, context):
    for name in protected_names:
        pattern = r'(?<![A-Za-z])' + re.escape(name) + r'(?![A-Za-z])'
        if len(re.findall(pattern, original)) != len(re.findall(pattern, translated)):
            errors.append(f'{context}: protected name changed or omitted: {name}')

def normalized(text):
    return re.sub(r'\s+', ' ', text).strip()


def numbers(text):
    return re.findall(r'\d+(?:\.\d+)?', text.replace(',', '.'))

photos = json.loads((root / 'lib/classic-photography.json').read_text())
image_source = set(json.loads((root / 'lib/image-alts.json').read_text()).values())
def collect_alts(value):
    if isinstance(value, dict):
        if value.get('alt'):
            image_source.add(value['alt'])
        for child in value.values():
            collect_alts(child)
    elif isinstance(value, list):
        for child in value:
            collect_alts(child)
collect_alts(photos)

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.language = None
        self.alternates = {}
        self.headings = []
        self.paragraphs = []
        self.current_paragraph = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'p' and attrs.get('data-copy'):
            self.current_paragraph = {'key': attrs['data-copy'], 'parts': []}
        if tag == 'a':
            self.links.append(attrs)
        elif tag == 'html':
            self.language = attrs.get('lang')
        elif tag == 'link' and attrs.get('rel') == 'alternate':
            self.alternates[attrs.get('hreflang')] = attrs.get('href')
        elif tag in {'h1', 'h2', 'h3', 'blockquote'}:
            self.headings.append(attrs)
    def handle_data(self, text):
        if self.current_paragraph is not None:
            self.current_paragraph['parts'].append(text)
    def handle_endtag(self, tag):
        if tag == 'p' and self.current_paragraph is not None:
            paragraph = self.current_paragraph
            self.paragraphs.append((paragraph['key'], normalized(''.join(paragraph['parts']))))
            self.current_paragraph = None

output = root / 'dist/client' / os.environ.get('NEXT_PUBLIC_BASE_PATH', '').strip('/')
for locale, tag in locales.items():
    target = json.loads((root / f'lib/locales/{locale}.json').read_text())
    image_target = json.loads((root / f'lib/locales/{locale}-images.json').read_text())
    if source.keys() != target.keys():
        errors.append(f'{locale}: translation keys differ from the approved source.')
    by_english = {entry['text']: key for key, entry in source.items()}
    for key, text in target.items():
        if locale == 'zh-Hans' and key in source:
            check_names(source[key]['text'], text, f'{locale}/{key}')
        if not text.strip() or text != unicodedata.normalize('NFC', text):
            errors.append(f'{locale}/{key}: empty or non-normalized translation.')
        if key in source and numbers(text) != numbers(source[key]['text']):
            errors.append(f'{locale}/{key}: factual numeric values changed.')
        if locale == 'es-LA' and re.search(r'\b(tú|vos|vosotros|vuestro|vuestra|tus|eres|puedes|descubre|únete)\b', text, re.I):
            errors.append(f'{locale}/{key}: unexpected informal address.')
    if image_source != image_target.keys():
        errors.append(f'{locale}: alt keys differ from the photograph registry.')
    if locale == 'zh-Hans':
        for original, translated in image_target.items():
            check_names(original, translated, f'{locale}/alt/{original}')
    if any(not text.strip() for text in image_target.values()):
        errors.append(f'{locale}: empty translated image description.')

    checked = 0
    for file in (output / locale).glob('**/index.html'):
        checked += 1
        parser = Document()
        parser.feed(file.read_text())
        original = Document()
        original_file = output / file.relative_to(output / locale)
        original.feed(original_file.read_text())
        original_headings = [h['data-heading'] for h in original.headings if h.get('data-heading')]
        translated_headings = [h['data-heading'] for h in parser.headings if h.get('data-heading')]
        expected_headings = [target[by_english[text]] for text in original_headings]
        if translated_headings != expected_headings:
            errors.append(f'{file}: localized headings differ from this page’s English headings.')
        if [key for key, _ in parser.paragraphs] != [key for key, _ in original.paragraphs]:
            errors.append(f'{file}: localized paragraph structure differs from the English page.')
        for key, text in parser.paragraphs:
            if key not in target or text != normalized(target[key]):
                errors.append(f'{file}: rendered paragraph does not match its translation: {key}')
        if parser.language != tag:
            errors.append(f'{file}: incorrect document language.')
        if set(parser.alternates) != {'en', 'es-419', 'zh-Hans'}:
            errors.append(f'{file}: incomplete language alternates.')
        for link in parser.links:
            href = link.get('href', '')
            if href.startswith('/') and href.endswith('/') and not link.get('hreflang') and f'/{locale}/' not in href:
                errors.append(f'{file}: navigation leaves the selected language: {href}')
        if locale == 'zh-Hans':
            for heading in parser.headings:
                if 'brand-heading' in heading.get('class', '') and 'heading-cjk' not in heading.get('class', ''):
                    errors.append(f'{file}: Chinese heading uses the Latin artwork renderer.')
    if checked != 17:
        errors.append(f'Expected 17 {locale} routes, found {checked}.')

    if locale == 'zh-Hans':
        manifest = json.loads((root / 'lib/chinese-font-coverage.json').read_text())
        rendered = ''.join(target.values()) + ''.join(image_target.values()) + '简中简体中文'
        missing = set(rendered) - set(manifest['characters'])
        if missing:
            errors.append(f'Chinese font subsets need regeneration: {sorted(missing)}')
        for font in manifest['fonts'].values():
            if hashlib.sha256((root / font['file']).read_bytes()).hexdigest() != font['sha256']:
                errors.append(f'Chinese font manifest mismatch: {font["file"]}')
        overview_keys = ['home', 'homeIntro', 'founderIntro', 'domeIntro', 'musicIntro', 'ranchoIntro', 'locationIntro', 'mediaName', 'mediaOrg', 'mediaEmail']
        overview = (root / 'public/press/vessyl-overview-zh-Hans.txt').read_text()
        if overview != '\n\n'.join(target[key] for key in overview_keys) + '\n':
            errors.append('Chinese press overview differs from its approved translated entries.')
    print(f'Checked {locale}: {len(target)} entries, {len(image_target)} alts and {checked} routes.')

if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: locale completeness, numeric facts, Spanish usted, Chinese font coverage, protected names, page-by-page source/translation correspondence, press overview, metadata and language-preserving navigation.')
