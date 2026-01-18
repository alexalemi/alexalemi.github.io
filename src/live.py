#!/usr/bin/env python3
"""Live reload development server for the blog.

Watches for changes to markdown files, templates, and data files,
recompiles the blog, and auto-refreshes the browser.

Usage: python3 src/live.py
       make live
"""
from livereload import Server, shell

server = Server()

# Watch blog markdown files
server.watch('blog/*.md', shell('python3 src/compile.py blog'), delay=1)

# Watch templates
server.watch('blog/templates/*.tpl', shell('python3 src/compile.py blog'), delay=1)

# Watch data files
server.watch('blog/data/*.json', shell('python3 src/compile.py blog'), delay=1)

print("Starting live reload server on http://localhost:8000")
print("Edit .md files in blog/ to see changes auto-reload in browser")
server.serve(root='.', port=8000, open_url_delay=1)
