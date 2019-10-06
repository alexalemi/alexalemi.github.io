

index.html: assets/stylesheets/theme.css templates/index.tpl data/research.json data/talks.json
	python src/compile.py
