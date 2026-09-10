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
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            self.links.append(attrs)
        elif tag == 'html':
            self.language = attrs.get('lang')
        elif tag == 'link' and attrs.get('rel') == 'alternate':
            self.alternates[attrs.get('hreflang')] = attrs.get('href')
        elif tag in {'h1', 'h2', 'h3', 'blockquote'}:
            self.headings.append(attrs)

output = root / 'dist/client' / os.environ.get('NEXT_PUBLIC_BASE_PATH', '').strip('/')
for locale, tag in locales.items():
    target = json.loads((root / f'lib/locales/{locale}.json').read_text())
    image_target = json.loads((root / f'lib/locales/{locale}-images.json').read_text())
    if source.keys() != target.keys():
        errors.append(f'{locale}: translation keys differ from the approved source.')
    for key, text in target.items():
        if not text.strip() or text != unicodedata.normalize('NFC', text):
            errors.append(f'{locale}/{key}: empty or non-normalized translation.')
        if key in source and numbers(text) != numbers(source[key]['text']):
            errors.append(f'{locale}/{key}: factual numeric values changed.')
        if locale == 'es-LA' and re.search(r'\b(tú|vos|vosotros|vuestro|vuestra|tus|eres|puedes|descubre|únete)\b', text, re.I):
            errors.append(f'{locale}/{key}: unexpected informal address.')
    if image_source != image_target.keys():
        errors.append(f'{locale}: alt keys differ from the photograph registry.')
    if any(not text.strip() for text in image_target.values()):
        errors.append(f'{locale}: empty translated image description.')

    checked = 0
    for file in (output / locale).glob('**/index.html'):
        checked += 1
        parser = Document()
        parser.feed(file.read_text())
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
print('PASS: locale completeness, numeric facts, Spanish usted, Chinese font coverage, press overview, metadata and language-preserving navigation.')
