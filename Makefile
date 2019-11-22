

all: index.html rss.xml

index.html: templates/index.tpl data/research.json data/talks.json
	python src/compile.py

rss.xml: data/research.json data/talks.json
	python src/rss.py
