

all: index.html rss.xml

index.html: templates/index.tpl data/research.json data/talks.json src/compile.py
	python src/compile.py

rss.xml: data/research.json data/talks.json src/rss.py
	python src/rss.py
