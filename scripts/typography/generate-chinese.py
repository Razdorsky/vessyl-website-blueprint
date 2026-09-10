#!/usr/bin/env python3
"""Subset official Noto SC variable masters for this site's current Chinese copy.

Requires fonttools[woff]. Run with --serif /path/NotoSerifSC.ttf
--sans /path/NotoSansSC.ttf. Full masters stay outside the repository.
"""
import argparse
import hashlib
import json
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--serif', type=Path, required=True)
parser.add_argument('--sans', type=Path, required=True)
args = parser.parse_args()
copy = json.loads((root / 'lib/locales/zh-Hans.json').read_text())
alts = json.loads((root / 'lib/locales/zh-Hans-images.json').read_text())
characters = ''.join(sorted(set(''.join(copy.values()) + ''.join(alts.values())
    + ''.join(chr(n) for n in range(32, 127)) + '简中简体中文©')))
manifest = {'characters': characters, 'weights': [400, 700], 'fonts': {}}
for name, master in [('serif', args.serif), ('sans', args.sans)]:
    font = TTFont(master)
    missing = {ord(c) for c in characters if not c.isspace()} - font.getBestCmap().keys()
    if missing:
        raise SystemExit(f'{name}: missing code points: {sorted(missing)}')
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=characters)
    subsetter.subset(font)
    font = instantiateVariableFont(font, {'wght': (400, 700)}, inplace=True)
    font.flavor = 'woff2'
    relative = f'app/font-assets/noto-{name}-sc-vessyl.woff2'
    output = root / relative
    font.save(output)
    manifest['fonts'][name] = {
        'file': relative,
        'source': f'https://github.com/google/fonts/tree/main/ofl/noto{name}sc',
        'sourceSha256': hashlib.sha256(master.read_bytes()).hexdigest(),
        'sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
        'bytes': output.stat().st_size,
    }
    print(f'{relative}: {output.stat().st_size:,} bytes')
(root / 'lib/chinese-font-coverage.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'Covered {len(characters)} characters in both variable fonts.')
