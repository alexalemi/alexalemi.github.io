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
PDF_SCHEME = "https://alexalemi.com/publications/"
TALK_SCHEME = "https://alexalemi.com/talks/"


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
  elif pub.get('link'):
    href = pub["link"]["href"]
    if pub.get("id"):
      fe.guid(os.path.join(PDF_SCHEME, pub["id"]), permalink=True)
    else:
      fe.guid(href)
    fe.link(href=href)
  return fe

def add_talk(fe, talk):
  fe.title(talk["title"])
  fe.guid(talk["id"], permalink=True)
  fe.published(convert_date(talk["date"]))
  fe.category(term="talks", scheme=TALK_SCHEME, label="talks")
  fe.link(href=talk["link"]["href"])
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
