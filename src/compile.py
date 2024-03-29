# /usr/bin/env python3
import sys
import jinja2
import json
import logging
import subprocess
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

def augment_obtude(post):
    post['links'] = post.get('links', []) 
    post['links'].append(
            {
                "href": f"https://obtudes.alexalemi.com/{post['src']}",
                "text": "[Obtude]",
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
        if filename in 'posts':
            data['posts'] = [augment_post(x) for x in data['posts']]
        elif filename in 'obtudes':
            data['obtudes'] = [augment_obtude(x) for x in data['obtudes']]
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
    data['writing'] = sorted(
            blog_data.get('posts', []) + data['writing'] + blog_data.get('obtudes', []),
            key=lambda x: x.get('date'),
            reverse=True)

    # Render the templated pages
    templates = [ROOT / Path('../templates/index.tpl')]
    for template_file in templates:
        process_template(template_file, data, ROOT / Path('..'))


def render_post(src):
    input_path = (ROOT / Path('../blog') / Path(src)).resolve()
    with open(input_path, 'r') as fin:
        with MathJaxRenderer() as renderer:
            content = renderer.render(Document(fin))
    return content


def convert_mj(path):
    """Precompile the mathjax."""
    # TODO: apparantely we can do this natively in Mathjax v3, look into that.
    # Right now uses `mjpage` installed with `npm install -g mathjax-node-page`
    logging.info(f"Converting {path} to html.")
    assert path.suffixes == ['.mj', '.html'], f"Doesn't end with correct suffix! {path}"
    newpath = path.with_suffix('').with_suffix('.html')
    # Use `mjpage --dollars < input.html > output.html` to generate a page with precompiled mathjax.
    with open(path, 'r') as fin, open(newpath, 'w') as fout:
        result = subprocess.run(['mjpage', '--dollars'], stdin=fin, stdout=fout, shell=True, check=True)


def process_post(template_file, post, force=False):
    src = post['src']
    input_path = (ROOT / Path('../blog') / Path(src)).resolve()
    output_path = input_path.with_suffix('.mj.html')

    # try to decide if necessary
    if not force and os.path.exists(output_path) and (os.path.getmtime(input_path) < os.path.getmtime(output_path)):
        # appears to not have been updated, skip
        logging.debug(f"Skipping {post['title']}")
        return
    else:
        logging.debug(f"Compiling {post['title']}")

    post['content'] = render_post(src)
    compile_template(
            template_file,
            post,
            output_path)
    convert_mj(output_path)

def blog(force=False):
    logging.debug("Compiling Blog..")
    blog_files = list((ROOT / Path('../blog/data/')).resolve().glob('*.json'))
    blog_data = load_data(blog_files)

    blog_data['index'] = sorted(blog_data['posts'] + blog_data['obtudes'], key=lambda x: x['date'], reverse=True)

    # Render the templated pages
    templates = [ROOT / Path('../blog/templates/index.tpl')]
    for template_file in templates:
        process_template(template_file, blog_data, ROOT / Path('../blog'))

    for post in blog_data['posts']:
        process_post(ROOT / Path('../blog/templates/post.tpl'), post, force=force)

if __name__ == '__main__':
    if sys.argv[1] == 'main':
      logging.info("Generating RSS Feed.")
      main()
    elif sys.argv[1] == 'blog':
      logging.info("Generating Blog RSS Feed.")
      if len(sys.argv) > 2 and sys.argv[2] == 'force':
          blog(force=True)
      else:
          blog()

