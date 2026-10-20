#!/usr/bin/env python3
"""Dependency-free checks for the static site's metadata, links and semantics.

Run from any directory: python3 scripts/audit.py
Browser layout, keyboard, contrast and external-service checks remain manual.
"""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://targetsagency.com'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.elements = []
        self.ids = []
        self.headings = []
        self.structured = []
        self.title = ''
        self.in_title = False
        self.in_json = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.headings.append(int(tag[1]))
        self.in_title = self.in_title or tag == 'title'
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_json = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script':
            self.in_json = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_json:
            self.structured.append(data)

    def tags(self, tag):
        return [attrs for name, attrs in self.elements if name == tag]

    def metadata(self, key):
        values = [a.get('content') for a in self.tags('meta')
                  if a.get('name', a.get('property')) == key]
        assert len(values) == 1 and values[0], (self.path, key, values)
        return values[0]


pages = {p.resolve(): Page(p) for p in ROOT.rglob('index.html')}
assert len(pages) == 11, 'Update expected page count when adding routes'
canonicals, titles, descriptions = set(), set(), set()
links_checked = 0
for path, page in pages.items():
    rel = path.relative_to(ROOT)
    url = ORIGIN + '/' + str(rel).removesuffix('index.html')
    expected_lang = 'en' if rel.parts[0] == 'en' else 'ar'
    doc = page.tags('html')[0]
    assert doc['lang'] == expected_lang
    assert doc['dir'] == ('ltr' if expected_lang == 'en' else 'rtl')
    assert len(page.ids) == len(set(page.ids)), (rel, 'duplicate IDs')
    assert page.headings.count(1) == 1 and page.headings[0] == 1
    assert all(b <= a + 1 for a, b in zip(page.headings, page.headings[1:]))
    assert any(a.get('id') == 'main-content' for a in page.tags('main'))
    assert any(a.get('class') == 'skip-link' and a.get('href') == '#main-content'
               for a in page.tags('a'))
    assert page.title and page.title not in titles
    titles.add(page.title)
    description = page.metadata('description')
    assert description not in descriptions
    descriptions.add(description)
    canonical = [a['href'] for a in page.tags('link') if a.get('rel') == 'canonical']
    assert canonical == [url], (rel, canonical)
    canonicals.add(url)
    for key in ('og:title', 'og:description', 'og:type', 'og:locale',
                'og:site_name', 'og:image', 'og:image:alt', 'og:image:width',
                'og:image:height', 'twitter:title', 'twitter:description',
                'twitter:card', 'twitter:image', 'twitter:image:alt'):
        page.metadata(key)
    assert page.metadata('og:url') == url
    alternates = {a['hreflang']: a['href'] for a in page.tags('link')
                  if a.get('rel') == 'alternate'}
    if rel.parts[0] != 'privacy':
        assert set(alternates) == {'ar', 'en', 'x-default'}
        assert alternates[expected_lang] == url
        assert alternates['x-default'] == alternates['ar']
        for language in ('ar', 'en'):
            other = ROOT / urlsplit(alternates[language]).path.lstrip('/') / 'index.html'
            other_alternates = {a['hreflang']: a['href'] for a in pages[other.resolve()].tags('link')
                                if a.get('rel') == 'alternate'}
            assert other_alternates == alternates, (rel, 'nonreciprocal language alternate')
    org = json.loads(''.join(page.structured))
    assert org['@type'] == 'Organization' and org['url'] == ORIGIN + '/'
    assert org['@id'] == ORIGIN + '/#organization'
    for img in page.tags('img'):
        assert 'alt' in img and int(img['width']) > 0 and int(img['height']) > 0
        if img['src'].endswith('arch.svg'):
            assert img.get('loading') != 'lazy' and img['alt']
    for tag, attrs in page.elements:
        href = attrs.get('href') or attrs.get('src')
        if not href:
            continue
        target = urlsplit(urljoin(url, href))
        if target.scheme == 'mailto':
            assert target.path == 'info@targetsagency.com'
            continue
        if target.netloc != 'targetsagency.com':
            if tag == 'a':
                assert target.scheme == 'https'
            if attrs.get('target') == '_blank':
                assert 'noopener' in attrs.get('rel', '').split()
            continue
        local = ROOT / unquote(target.path).lstrip('/')
        if local.is_dir():
            local /= 'index.html'
        assert local.is_file(), (rel, href, 'missing target')
        if target.fragment:
            assert unquote(target.fragment) in pages[local.resolve()].ids, (rel, href)
        links_checked += 1
sitemap = ET.parse(ROOT / 'sitemap.xml')
locations = [e.text for e in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(locations) == len(set(locations)) and set(locations) == canonicals
assert 'Sitemap: ' + ORIGIN + '/sitemap.xml' in (ROOT / 'robots.txt').read_text()
assert 'Disallow: /' not in (ROOT / 'robots.txt').read_text()
print(f'PASS: {len(pages)} pages, {links_checked} local references, metadata, headings, images, Organization JSON-LD and sitemap.')
