.PHONY = serve

all: index.html rss.xml

index.html: templates/index.tpl data/research.json data/talks.json src/compile.py data/posts.json $(wildcard blog/*.md) templates/blog/index.tpl templates/post.tpl
	python src/compile.py

rss.xml: data/research.json data/talks.json src/rss.py data/posts.json $(wildcard blog/**/*)
	python src/rss.py

serve:
	python -m http.server

