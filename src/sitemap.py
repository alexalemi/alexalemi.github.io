#!/usr/bin/env python3
"""Generate the sitemaps.

Usage: python3 src/sitemap.py main
       python3 src/sitemap.py blog
"""

import sys
import json
import logging
from pathlib import Path
from xml.sax.saxutils import escape

logging.basicConfig(level=logging.DEBUG)

ROOT = Path(__file__).resolve().parent
MAIN_ROOT = "https://alexalemi.com/"
BLOG_ROOT = "https://blog.alexalemi.com/"
OBTUDE_ROOT = "https://blog.alexalemi.com/ob/nbs/"


def load(path):
    with open((ROOT / path).resolve(), 'r') as f:
        return json.load(f)


def published(entries):
    return [x for x in entries if not x.get('draft') and not x.get('hidden')]


def newest(entries):
    """Latest date among the entries, dates are YYYY-MM or YYYY-MM-DD."""
    return max((x['date'] for x in entries if x.get('date')), default=None)


def write_sitemap(urls, output_path):
    """Write a sitemap from a list of (url, lastmod) pairs, lastmod may be None."""
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, lastmod in urls:
        lines.append('  <url>')
        lines.append(f'    <loc>{escape(url)}</loc>')
        if lastmod:
            lines.append(f'    <lastmod>{lastmod}</lastmod>')
        lines.append('  </url>')
    lines.append('</urlset>')
    output_path = (ROOT / output_path).resolve()
    logging.info(f"Writing {len(urls)} urls to {output_path}")
    with open(output_path, 'w') as f:
        f.write('\n'.join(lines) + '\n')


def extra_main_pages():
    """Standalone pages on alexalemi.com to list besides the homepage.

    Returns a list of (path, lastmod) pairs, with path relative to the site
    root and lastmod a YYYY-MM-DD string or None.
    """
    return [
        # random/sliderule.html is a redirect stub, this is its canonical url
        ("random/sliderule/index.html", None),
    ]


def main():
    posts = published(load('../blog/data/posts.json') + load('../blog/data/obtudes.json'))
    entries = (posts + load('../data/writing.json') + load('../data/research.json')
               + load('../data/talks.json'))
    urls = [(MAIN_ROOT, newest(entries))]
    urls += [(MAIN_ROOT + path, lastmod) for path, lastmod in extra_main_pages()]
    write_sitemap(urls, '../sitemap.xml')


def blog():
    posts = published(load('../blog/data/posts.json'))
    obtudes = published(load('../blog/data/obtudes.json'))
    urls = [(BLOG_ROOT, newest(posts + obtudes))]
    urls += [(BLOG_ROOT + x['src'].replace('.md', '.html'), x.get('date')) for x in posts]
    urls += [(OBTUDE_ROOT + x['src'], x.get('date')) for x in obtudes]
    write_sitemap(urls, '../blog/sitemap.xml')


if __name__ == '__main__':
    if sys.argv[1] == 'main':
        main()
    elif sys.argv[1] == 'blog':
        blog()
