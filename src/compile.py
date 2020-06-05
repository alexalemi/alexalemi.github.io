import jinja2
import json
import logging
import mistletoe
import os
from pathlib import Path


logging.basicConfig(level=logging.DEBUG)

ROOT =          Path(__file__).resolve().parent
TEMPLATE_PATH = Path('../templates')
TEMPLATES =     [Path('index.tpl'), Path('blog/index.tpl')]
POST_TEMPLATE = Path('post.tpl')
DATA_PATH =     Path('../data')
BLOG_PATH =     Path('../blog')
BLOG_DATA_PATH =     Path('../blog/data')
BUILD_PATH =    Path('..')


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
    logging.info(f"Loading data from {[x.name for x in data_files]}.")
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


def process_template(template_path, data):
    logging.debug(f"Compiling {template_path}")
    template_file = (ROOT / TEMPLATE_PATH / template_path).resolve()
    filename = template_file.stem
    output_path = ROOT / BUILD_PATH / template_file.relative_to((ROOT / TEMPLATE_PATH).resolve()).with_suffix('.html')
    compile_template(
        template_file,
        data,
        output_path
    )

def process_post(template_file, post):
    logging.debug(f"Compiling {post['title']}")
    src = post['src']
    input_path = (ROOT / BLOG_PATH / Path(src)).resolve()
    output_path = input_path.with_suffix('.html')
    with open(input_path, 'r') as fin:
        post['content'] = mistletoe.markdown(fin)
    compile_template(
            template_file,
            post,
            output_path)

def main():
    logging.debug("Compiling..")
    templates = (ROOT / TEMPLATE_PATH).resolve().glob('*/*.tpl')
    data_files = list((ROOT / DATA_PATH).resolve().glob('*.json'))
    blog_files = list((ROOT / BLOG_DATA_PATH).resolve().glob('*.json'))
    data = load_data(data_files)
    blog_data = load_data(blog_files)

    # weave writing and posts
    data['writing'] = blog_data.get('posts', []) + data['writing']

    # Render the templated pages
    for template_file in TEMPLATES:
        process_template(template_file, data)


def blog():
    logging.debug("Compiling Blog..")
    blog_files = list((ROOT / BLOG_DATA_PATH).resolve().glob('*.json'))
    blog_data = load_data(blog_files)

    for post in blog_data['posts']:
        process_post((ROOT / TEMPLATE_PATH / POST_TEMPLATE), post)

if __name__ == '__main__':

    main()

    blog()

