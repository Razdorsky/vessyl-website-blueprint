#!/usr/bin/env python3
"""Check exported copy against the source-linked production dictionary, not a second authored draft."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import json,re,os,sys
from urllib.parse import urlsplit
from xml.etree import ElementTree
root=Path(__file__).resolve().parents[1]
base=os.environ.get('NEXT_PUBLIC_BASE_PATH','').strip('/')
output=root/'dist/client'/base
entries=json.loads((root/'lib/approved-copy.json').read_text())
class Node:
 def __init__(self,tag='',attrs=()):self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self):return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.root=Node();self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=Node(t,a);self.stack[-1].children.append(n)
  if t not in ['img','input','br','hr','meta','link','source','area','wbr','embed']:self.stack.append(n)
  if t=='br':n.children.append(' ')
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,s):self.stack[-1].children.append(s)
def norm(t):return re.sub(r'\s+',' ',t).strip()
def lowercase_start(t):
 # Standalone copy must start with a capital; contact addresses and URLs retain their spelling.
 if re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',t) or re.match(r'^(?:https?://|www\.)',t):return False
 return bool(re.match(r'^[\s\"\'“‘(]*[a-z]',t))
spanish=json.loads((root/'lib/locales/es-LA.json').read_text())
translations={locale:json.loads((root/f'lib/locales/{locale}.json').read_text()) for locale in ['es-LA','zh-Hans']}
known={norm(x['text']):x for x in entries.values()}
# Factual destinations and operational structure, not marketing prose.
operational={'EN','ES','简中','©','Vessyl','AKEN','AKEN Soul','Quantum','Wellness','All sessions','guestservices@thevessyl.com','reservations@akenhotels.com','+506 8608 0022','12 s ·','Sound off','Play film','Pause film','Page not found','Overview','Close','Vessyl navigation','Choose a page to explore.'}
ignored={'script','style','svg','template','noscript','head'}
semantic={'h1','h2','h3','h4','p','blockquote','a','button','summary','li','label','dt','dd','figcaption','span','small'}
def units(n):
 if n.tag in ignored or n.attrs.get('aria-hidden')=='true':return []
 if n.tag in semantic and not any(isinstance(c,Node) and c.tag in {'p','h1','h2','h3','li','a','button','div'} for c in n.children):
  return [norm(n.text())] if norm(n.text()) else []
 return sum((units(c) if isinstance(c,Node) else ([norm(c)] if norm(c) else []) for c in n.children),[])
def allnodes(n):
 yield n
 for c in n.children:
  if isinstance(c,Node):yield from allnodes(c)
def classify(t):
 if t in known:return known[t]['kind'],known[t]['source']
 if t in operational or re.fullmatch(r'[\d\s/·©]+',t):return 'functional-ui','interface-behavior'
 if t.startswith('© ') and re.fullmatch(r'© \d{4} Vessyl',t):return 'functional-ui','interface-behavior'
 # Card controls and media captions can concatenate their inner semantic labels.
 remaining=t
 for k in sorted(set(known)|operational,key=len,reverse=True):remaining=remaining.replace(k,'')
 if not re.sub(r'[\d\s/·©]+','',remaining):return 'composed-approved-labels','multiple documented entries'
 return 'UNSOURCED',None
errors=[];report={};main={};word_symbols={}
for copy_key,entry in entries.items():
 if lowercase_start(entry['text']):errors.append('Lowercase copy start: '+copy_key+': '+entry['text'])
 if entry.get('kind')=='capitalization-corrected' and entry['text'].lower()!=entry.get('sourceText','').lower():
  errors.append('Capitalization edit changed wording: '+copy_key)
for edition in ['classic']:
 for f in sorted(output.glob('**/index.html')):
  if f.parent==output/'404':continue
  slug=str(f.parent.relative_to(output));key=edition+'/'+('home' if slug=='.' else slug)
  locale=next((loc for loc in translations if loc in f.relative_to(output).parts),'en')
  known={norm(translations[locale][k] if locale!='en' else v['text']):v for k,v in entries.items()}
  p=Parser();p.feed(f.read_text());rows=[]
  for t in units(p.root):
   kind,source=classify(t);rows.append({'text':t,'kind':kind,'source':source})
   if kind=='UNSOURCED':errors.append(key+': '+t)
   if lowercase_start(t):errors.append('Lowercase rendered copy: '+key+': '+t)
  for n in allnodes(p.root):
   if 'brand-heading' not in n.attrs.get('class','').split():continue
   label=n.attrs.get('data-heading','')
   uses=[x.attrs.get('href','') for x in allnodes(n) if x.tag=='use']
   if 'heading-cjk' in n.attrs.get('class','').split():
    if locale!='zh-Hans' or norm(n.text())!=norm(label) or uses:
     errors.append('Invalid native Chinese heading: '+key+': '+label)
   elif 'heading-fluid' in n.attrs.get('class','').split():
    if len(uses)!=len(label.split()):errors.append('Incomplete Telugu word outlines: '+key+': '+label)
    for href in uses:
     parsed=urlsplit(href);name=Path(parsed.path).name
     if name not in word_symbols:
      path=root/'public/typography'/name
      word_symbols[name]={x.attrib['id'] for x in ElementTree.parse(path).iter() if x.tag.endswith('symbol') and 'id' in x.attrib} if path.is_file() else set()
     if parsed.fragment not in word_symbols[name]:errors.append('Missing Telugu word symbol: '+key+': '+href)
   elif not any(x.tag=='picture' for x in allnodes(n)):
    errors.append('Missing Telugu artwork: '+key+': '+label)
  report[key]=rows
  content=next(n for n in allnodes(p.root) if n.attrs.get('id')=='content')
  main[key]=[t for t in units(content) if t not in {'Loading','Interactive interpretation','Play','Pause'}]
# Founder has its own editorial copy. Shared navigation, names, attribution and
# short action labels remain consistent; prose and complete sentences must not
# be reused from another Classic page, even inside a longer paragraph.
def prose_sentences(text):
 return [norm(s).casefold() for s in re.split(r'(?<=[.!?])\s+|(?<=[。！？])',text)
         if (len(re.findall(r"\b[\w']+\b",s))>=8 or len(re.findall(r"[\u3400-\u9fff]",s))>=18)
         # The Nature gallery repeats the activity's approved name. Its Spanish
         # title exceeds eight words; it is still a caption, not repeated prose.
         and norm(s) not in {entries['natureWalk']['text'],spanish['natureWalk']}]
founder_duplicates=[]
def page_locale(page):
 return next((loc for loc in translations if page.startswith('classic/'+loc+'/')),'en')
for locale_prefix in ['', 'es-LA/', 'zh-Hans/']:
 founder_page='classic/'+locale_prefix+'founder'
 for text in main.get(founder_page,[]):
  for sentence in prose_sentences(text):
   for page,texts in main.items():
    if not page.startswith('classic/') or page==founder_page or page_locale(page)!=page_locale(founder_page):continue
    if any(sentence in norm(other).casefold() for other in texts):
     founder_duplicates.append({'page':page,'sentence':sentence})
     errors.append('Founder editorial copy repeats '+page+': '+sentence)
uniqueness_path=root/'docs/compliance/founder-uniqueness.json'
uniqueness_path.parent.mkdir(parents=True,exist_ok=True)
uniqueness_path.write_text(json.dumps({
 'scope':'Founder editorial sentences of at least eight words or 18 Han characters versus other pages in the same locale; shared navigation, names and short UI labels excluded.',
 'duplicates':founder_duplicates,
},ensure_ascii=False,indent=2)+'\n')
# Repeated functional labels stay consistent; complete editorial sentences must
# not repeat within a Classic page. Dialog disclosure is checked separately in UI QA.
classic_duplicates={}
for page,texts in main.items():
 if not page.startswith('classic/'):continue
 duplicates={t:n for t,n in Counter(sentence for t in texts
  for sentence in prose_sentences(t)).items() if n>1}
 if duplicates:classic_duplicates[page]=duplicates
 for text,count in duplicates.items():errors.append(f'{page} editorial sentence repeats {count} times: '+text)
(root/'docs/compliance/classic-uniqueness.json').write_text(json.dumps(classic_duplicates,ensure_ascii=False,indent=2)+'\n')
# Every selected container-aware display variant must exist with usable dimensions.
art=json.loads((root/'lib/typography-art.json').read_text())
for key,entry in art.items():
 for variant in entry.get('responsive',{}).values():
  path=root/'public/typography'/variant['file']
  if not path.is_file() or variant['width']<=0 or variant['height']<=0:
   errors.append('Invalid responsive heading artwork: '+key)
# Blueprint is a Classic-only publishing surface, and must never initialize 3D.
for f in output.glob('**/index.html'):
 if 'data-renderer="independent-scroll-world"' in f.read_text():errors.append('Immersive renderer leaked into Blueprint: '+str(f))
if len(report)!=51:errors.append('Expected 51 Blueprint routes, found '+str(len(report)))
report_path=root/'docs/compliance/copy-coverage.json'
report_path.parent.mkdir(parents=True,exist_ok=True)
report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if errors:print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(report)} routes; every rendered text unit is source-linked copy or documented interface behavior; display headings have approved Latin artwork or native Chinese text; Classic-only renderer verified.')
print('PASS: Founder editorial sentences do not repeat another Classic page.')
print('PASS: No repeated editorial sentences within any Classic page; responsive artwork references verified.')
