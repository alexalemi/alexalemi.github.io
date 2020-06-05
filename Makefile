.PHONY = serve

all: index.html rss.xml blog/index.html blog/rss.xml

index.html: templates/index.tpl data/research.json data/talks.json data/writing.json src/compile.py blog/data/posts.json 
	python src/compile.py main

blog/index.html: src/compile.py blog/data/posts.json $(wildcard blog/*.md) blog/templates/index.tpl blog/templates/post.tpl
	python src/compile.py blog

rss.xml: data/research.json data/talks.json src/rss.py data/writing.json blog/data/posts.json $(wildcard blog/*.md)
	python src/rss.py main

blog/rss.xml: src/rss.py blog/data/posts.json
	python src/rss.py blog

serve:
	python -m http.server

