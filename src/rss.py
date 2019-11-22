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
BUILD_PATH = "../publications"
PDF_PATH = "https://alexalemi.com/publications/"


def convert_date(s):
  return datetime.datetime.strptime(s, "%Y-%m").astimezone()

def annotate(fe, publication):
  fe.title(pub.get('title'))
  fe.published(convert_date(pub.get('date')))

  if pub.get('file'):
    pdf_path = os.path.join(PDF_PATH, pub.get("file"))
    fe.id(pdf_path)
    fe.link(href=pdf_path)
    fe.enclosure(pdf_path, 0, "application/pdf")
  elif pub.get('link'):
    href = pub.get('link').get('href')
    fe.id(href)
    fe.link(href=href)
  return fe


if __name__ == "__main__":
  fg = FeedGenerator()
  fg.id("https://alexalemi.com/publications/rss.xml")
  fg.title("Alexander A. Alemi's Publications")
  fg.author({"name": "Alexander A. Alemi", "email": "alexalemi@gmail.com"})
  fg.link(href="https://alexalemi.com", rel="alternate")
  fg.logo("http://alexalemi.com/favicon.ico")
  fg.subtitle("Follow my publications and talks.")
  fg.link(href="https://alexalemi.com/publications/rss.xml", rel="self")
  fg.language("en")


  with open(os.path.join(DATA_PATH, "research.json"), 'r') as f:
      data = json.load(f)

      for pub in data:
        fe = fg.add_entry()
        annotate(fe, pub)


rssfeed = fg.rss_file(os.path.join(BUILD_PATH, RSS_FILENAME))
