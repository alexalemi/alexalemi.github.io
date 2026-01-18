.PHONY = serve

all: index.html rss.xml blog/index.html blog/rss.xml

# Ensure Node.js dependencies are installed for MathJax compilation
src/node_modules: src/package.json
	cd src && npm install
	@touch $@

index.html: templates/index.tpl data/research.json data/talks.json data/writing.json src/compile.py blog/data/posts.json
	python3 src/compile.py main

blog/index.html: src/compile.py src/node_modules blog/data/posts.json $(wildcard blog/*.md) blog/templates/index.tpl blog/templates/post.tpl
	python3 src/compile.py blog

rss.xml: data/research.json data/talks.json src/rss.py data/writing.json blog/data/posts.json $(wildcard blog/*.md)
	python3 src/rss.py main

blog/rss.xml: src/rss.py blog/data/posts.json
	python3 src/rss.py blog

serve:
	python3 -m http.server

