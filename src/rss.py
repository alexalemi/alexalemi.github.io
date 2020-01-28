# Lint as: python3
"""Generate the RSS feeds."""

import json
import logging
import datetime
import os
from feedgen.feed import FeedGenerator


logging.basicConfig(level=logging.DEBUG)

ROOT = os.path.dirname(os.path.realpath(__file__))
RSS_FILENAME = "rss.xml"
DATA_PATH = "../data"
BUILD_PATH = "../"
PDF_PATH = "../publications/"
TALKS_PATH = "../talks/"
PDF_SCHEME = "https://alexalemi.com/publications/"
TALK_SCHEME = "https://alexalemi.com/talks/"

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

def add_publication(fe, publication):
  fe.title(pub["title"])
  fe.published(convert_date(pub["date"]))
  fe.category(term="publications", scheme=PDF_PATH, label="publications")

  if pub.get('file'):
    pdf_path = os.path.join(PDF_SCHEME, pub["file"])
    fe.guid(pdf_path, permalink=True)
    fe.link(href=pdf_path)
    size = os.path.getsize(os.path.join(ROOT, PDF_PATH, pub["file"]))
    fe.enclosure(pdf_path, str(size), "application/pdf")
  elif pub.get('links'):
    for link in pub.get('links', []):
      href = link["href"]
      fe.link(href=href)
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
  for link in talk.get('links', []):
    target = link["href"]
    fe.link(href=target, rel="alternate")
  href = os.path.join(TALK_SCHEME, talk["id"] + ".html")
  fe.guid(href, permalink=True)
  with open(os.path.join(ROOT, TALKS_PATH, talk["id"] + ".html"), "w") as f:
      f.write(REDIRECT_TEMPLATE.format(href=target))
  fe.published(convert_date(talk["date"]))
  fe.category(term="talks", scheme=TALK_SCHEME, label="talks")
  fe.description(
          f"{talk.get('description', '')} / {talk.get('venue', '')}",
          isSummary=True)
  return fe


if __name__ == "__main__":
  logging.info("Generating RSS Feed.")
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


  outpath = os.path.join(ROOT, BUILD_PATH, RSS_FILENAME)
  logging.info(f"Writing to {outpath}")
  rssfeed = fg.rss_file(outpath)
