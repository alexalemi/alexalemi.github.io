# Lint as: python3
"""Generate the RSS feeds."""

import sys
import json
import logging
import datetime
import urllib.parse
import os
from feedgen.feed import FeedGenerator
from compile import augment_post, render_post

logging.basicConfig(level=logging.DEBUG)

ROOT = os.path.dirname(os.path.realpath(__file__))
RSS_FILENAME = "rss.xml"
BLOG_RSS_FILENAME = "blog/rss.xml"
DATA_PATH = "../data"
BLOG_DATA_PATH = "../blog/data"
BUILD_PATH = "../"
PDF_PATH = "../publications/"
TALKS_PATH = "../talks/"
PDF_SCHEME = "https://alexalemi.com/publications/"
TALK_SCHEME = "https://alexalemi.com/talks/"
POST_SCHEME = "https://alexalemi.com/posts/"
MAIN_ROOT = "https://alexalemi.com"
BLOG_ROOT = "https://blog.alexalemi.com"
OBTUDE_ROOT = "https://obtudes.alexalemi.com"

REDIRECT_TEMPLATE = """<!DOCTYPE html>
<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-153903138-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'UA-153903138-1');
</script>
</head>
<meta charset="utf-8">
<title>Redirecting to <a href="{href}">{href}</a>.</title>
<meta http-equiv="refresh" content="0; URL={href}">
<link rel="canonical" href="{href}">"""


def convert_date(s):
  return datetime.datetime.strptime(s, "%Y-%m").astimezone()

def convert_date_full(s):
  return datetime.datetime.strptime(s, "%Y-%m-%d").astimezone()

def urljoin(part1, part2):
    return urllib.parse.urljoin(part1, part2)

def add_publication(fe, pub):
  fe.title(pub["title"])
  fe.published(convert_date(pub["date"]))
  fe.category(term="publications", scheme=PDF_PATH, label="publications")

  if pub.get('file'):
    pdf_path = os.path.join(PDF_SCHEME, pub["file"])
    fe.guid(pdf_path, permalink=True)
    fe.link(href=urljoin(MAIN_ROOT, pdf_path))
    size = os.path.getsize(os.path.join(ROOT, PDF_PATH, pub["file"]))
    fe.enclosure(pdf_path, str(size), "application/pdf")
  elif pub.get('links'):
    for link in pub.get('links', []):
      href = link["href"]
      fe.link(href=urljoin(MAIN_ROOT, href))
    if pub.get("id"):
      fe.guid(os.path.join(PDF_SCHEME, pub["id"] + ".html"), permalink=True)
      with open(os.path.join(ROOT, PDF_PATH, pub["id"] + ".html"), "w") as f:
          f.write(REDIRECT_TEMPLATE.format(href=href))
    else:
      fe.guid(href)
  if pub.get('arxiv'):
      fe.link(href=f"https://arxiv.org/abs/{pub['arxiv']}", rel="alternate")

  fe.description(
          f"{pub.get('description', '')} / {pub.get('authors', '')} / {pub.get('arxiv', '')} / {pub.get('venue', '')}",
          isSummary=True)
  return fe

def add_talk(fe, talk):
  fe.title(talk["title"])
  canonical_target = None
  for link in talk.get('links', []):
    target = link["href"]
    if link.get("canonical"):
        canonical_target = target
    fe.link(href=urljoin(MAIN_ROOT, target), rel="alternate")
  if canonical_target is None:
      canonical_target = target
  href = os.path.join(TALK_SCHEME, talk["id"] + ".html")
  fe.guid(href, permalink=True)
  with open(os.path.join(ROOT, TALKS_PATH, talk["id"] + ".html"), "w") as f:
      f.write(REDIRECT_TEMPLATE.format(href=canonical_target))
  fe.published(convert_date(talk["date"]))
  fe.category(term="talks", scheme=TALK_SCHEME, label="talks")
  fe.description(
          f"{talk.get('description', '')} / {talk.get('venue', '')}",
          isSummary=True)
  return fe

def add_post(fe, post, content=None):
  fe.title(post["title"])
  href = None
  for link in post.get('links', []):
    target = link["href"]
    fe.link(href=urljoin(BLOG_ROOT, target), rel="alternate")
    if href is None:
        href = target
    if link.get("canonical"):
        href = target
  if href is not None:
      fe.guid(urljoin(BLOG_ROOT, href), permalink=True)
  else:
      href = urljoin(BLOG_ROOT, f"{post['id']}.html")
      fe.guid(href, permalink=True)
  fe.published(convert_date_full(post["date"]))
  fe.category(term="posts", scheme=POST_SCHEME, label="posts")
  fe.description(
          f"{post.get('description', '')}",
          isSummary=True)
  if content is not None:
      fe.content(content)
  return fe

def add_obtude(fe, post, content=None):
  fe.title(post["title"])
  href = None
  for link in post.get('links', []):
    target = link["href"]
    fe.link(href=urljoin(OBTUDE_ROOT, target), rel="alternate")
    if link.get("canonical"):
        href = target
  fe.guid(urljoin(OBTUDE_ROOT, href), permalink=True)
  fe.published(convert_date_full(post["date"]))
  fe.category(term="obtudes", scheme=POST_SCHEME, label="obtudes")
  fe.description(
          f"{post.get('description', '')}",
          isSummary=True)
  if content is not None:
      fe.content(content)
  return fe


def main():
  # Main Feed
  fg = FeedGenerator()
  fg.id("https://alexalemi.com/rss.xml")
  fg.title("AlexAlemi.com")
  fg.author({"name": "Alexander A. Alemi", "email": "alexalemi@gmail.com"})
  fg.link(href="https://alexalemi.com", rel="alternate")
  fg.logo("http://alexalemi.com/favicon.ico")
  fg.subtitle("Follow my publications and talks.")
  fg.link(href="https://alexalemi.com/rss.xml", rel="self")
  fg.language("en")


  with open(os.path.join(ROOT, DATA_PATH, "research.json"), 'r') as f:
      data = json.load(f)
      for pub in data:
        fe = fg.add_entry()
        add_publication(fe, pub)

  with open(os.path.join(ROOT, DATA_PATH, "talks.json"), 'r') as f:
      data = json.load(f)
      for talk in data:
        fe = fg.add_entry()
        add_talk(fe, talk)

  with open(os.path.join(ROOT, BLOG_DATA_PATH, "posts.json"), 'r') as f:
      data = json.load(f)
      for post in data:
        # only include featured not hidden and not draft
        if post.get('featured', False) and not post.get('hidden', False) and not post.get('draft', False):
            fe = fg.add_entry()
            content = render_post(post['src'])
            add_post(fe, post, content)

  with open(os.path.join(ROOT, BLOG_DATA_PATH, "obtudes.json"), 'r') as f:
      data = json.load(f)
      for post in data:
        # only include featured not hidden and not draft
        if post.get('featured', False) and not post.get('hidden', False) and not post.get('draft', False):
            fe = fg.add_entry()
            add_obtude(fe, post)

  with open(os.path.join(ROOT, DATA_PATH, "writing.json"), 'r') as f:
      data = json.load(f)
      for post in data:
        fe = fg.add_entry()
        add_post(fe, post)

  outpath = os.path.join(ROOT, BUILD_PATH, RSS_FILENAME)
  logging.info(f"Writing to {outpath}")
  rssfeed = fg.rss_file(outpath)


def blog():
  # Main Feed
  fg = FeedGenerator()
  fg.id("https://blog.alexalemi.com/rss.xml")
  fg.title("Blog.AlexAlemi.com")
  fg.author({"name": "Alexander A. Alemi's Blog", "email": "alexalemi@gmail.com"})
  fg.link(href="https://blog.alexalemi.com", rel="alternate")
  fg.logo("http://blog.alexalemi.com/favicon.ico")
  fg.subtitle("Various musings.")
  fg.link(href="https://blog.alexalemi.com/rss.xml", rel="self")
  fg.language("en")

  with open(os.path.join(ROOT, BLOG_DATA_PATH, "posts.json"), 'r') as f:
      data = json.load(f)
      for post in data:
        if not post.get('hidden', False) and not post.get('draft', False):
            fe = fg.add_entry()
            post = augment_post(post)
            content = render_post(post['src'])
            add_post(fe, post, content)

  outpath = os.path.join(ROOT, BUILD_PATH, BLOG_RSS_FILENAME)
  logging.info(f"Writing to {outpath}")
  rssfeed = fg.rss_file(outpath)

if __name__ == "__main__":
    if sys.argv[1] == 'main':
      logging.info("Generating RSS Feed.")
      main()
    elif sys.argv[1] == 'blog':
      logging.info("Generating Blog RSS Feed.")
      blog()




