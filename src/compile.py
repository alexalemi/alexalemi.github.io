import sys
import jinja2
import json
import logging
from mistletoe import Document
from mathjax import MathJaxRenderer
import os
from pathlib import Path


logging.basicConfig(level=logging.DEBUG)

ROOT = Path(__file__).resolve().parent


def augment_post(post):
    post['links'] = post.get('links', []) 
    post['links'].append(
            {
                "href": f"https://blog.alexalemi.com/{post['src'].replace('.md', '.html')}",
                "text": "[Blog]",
                "canonical": True
            })
    return post

def load_data(data_files):
    logging.info(f"Loading data from {[x.stem for x in data_files]}.")
    data = {}
    for data_file in data_files:
        logging.debug(f"Reading {data_file}...")
        filename = data_file.stem
        with open(data_file, 'r') as f:
            data[filename] = json.load(f)
        if filename == 'posts':
            data['posts'] = [augment_post(x) for x in data['posts']]
    return data


def compile_template(template_path, data, output_path):
    logging.debug(f"Compiling {template_path} to {output_path}...")
    template_path = template_path.resolve()

    env = jinja2.environment.Environment(
        loader=jinja2.FileSystemLoader(template_path.parent))

    template = env.get_template(template_path.name)

    with open(output_path, 'w') as f:
        f.write(template.render(**data))


def process_template(template_file, data, output_dir):
    logging.debug(f"Compiling {template_file}")
    filename = template_file.stem
    output_path = output_dir / template_file.with_suffix('.html').name
    compile_template(
        template_file,
        data,
        output_path
    )

def main():
    logging.debug("Compiling..")
    data_files = list((ROOT / Path('../data/')).resolve().glob('*.json'))
    blog_files = list((ROOT / Path('../blog/data/')).resolve().glob('*.json'))
    data = load_data(data_files)
    blog_data = load_data(blog_files)

    # weave writing and posts
    data['writing'] = blog_data.get('posts', []) + data['writing']

    # Render the templated pages
    templates = [ROOT / Path('../templates/index.tpl')]
    for template_file in templates:
        process_template(template_file, data, ROOT / Path('..'))


def process_post(template_file, post):
    logging.debug(f"Compiling {post['title']}")
    src = post['src']
    input_path = (ROOT / Path('../blog') / Path(src)).resolve()
    output_path = input_path.with_suffix('.html')
    with open(input_path, 'r') as fin:
        with MathJaxRenderer() as renderer:
            post['content'] = renderer.render(Document(fin))
    compile_template(
            template_file,
            post,
            output_path)

def blog():
    logging.debug("Compiling Blog..")
    blog_files = list((ROOT / Path('../blog/data/')).resolve().glob('*.json'))
    blog_data = load_data(blog_files)

    # Render the templated pages
    templates = [ROOT / Path('../blog/templates/index.tpl')]
    for template_file in templates:
        process_template(template_file, blog_data, ROOT / Path('../blog'))

    for post in blog_data['posts']:
        process_post(ROOT / Path('../blog/templates/post.tpl'), post)

if __name__ == '__main__':
    if sys.argv[1] == 'main':
      logging.info("Generating RSS Feed.")
      main()
    elif sys.argv[1] == 'blog':
      logging.info("Generating Blog RSS Feed.")
      blog()

