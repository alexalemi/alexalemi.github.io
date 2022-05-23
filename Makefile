.PHONY = serve

all: index.html rss.xml blog/index.html blog/rss.xml

index.html: templates/index.tpl data/research.json data/talks.json data/writing.json src/compile.py blog/data/posts.json 
	python3 src/compile.py main

blog/index.html: src/compile.py blog/data/posts.json $(wildcard blog/*.md) blog/templates/index.tpl blog/templates/post.tpl
	python3 src/compile.py blog

rss.xml: data/research.json data/talks.json src/rss.py data/writing.json blog/data/posts.json $(wildcard blog/*.md)
	python3 src/rss.py main

blog/rss.xml: src/rss.py blog/data/posts.json
	python3 src/rss.py blog

serve:
	python3 -m http.server

