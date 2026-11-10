# /usr/bin/env python3
import sys
import jinja2
import re
import itertools
import json
import logging
import subprocess
from mistletoe import Document
from mathjax import MathJaxRenderer
import os
import shutil
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
                "href": f"https://blog.alexalemi.com/ob/nbs/{post['src']}",
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


def render_template(template_path, data):
    template_path = template_path.resolve()
    env = jinja2.environment.Environment(
        loader=jinja2.FileSystemLoader(template_path.parent))
    return env.get_template(template_path.name).render(**data)


def compile_template(template_path, data, output_path):
    logging.debug(f"Compiling {template_path} to {output_path}...")
    with open(output_path, 'w') as f:
        f.write(render_template(template_path, data))


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

def replace_counters(text):
    """Find all xx\w\d+ patterns, group them by the \w and number them consecutively."""
    patts = re.findall("xx[a-z][_\-a-zA-Z0-9]+", text)
    groups = set(x[2] for x in patts)
    for group in groups:
        logging.debug(f"Replacing counters in group {group}")
        instances = { x: None for x in patts if x[2] == group }
        for i, instance in enumerate(instances):
            text = text.replace(instance, str(i+1))
    return text

def replace_letters(text):
    """Find all xx\w\d+ patterns, group them by the \w and number them consecutively."""
    patts = re.findall("xx[A-Z][_\-a-zA-Z0-9]+", text)
    groups = set(x[2] for x in patts)
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for group in groups:
        logging.debug(f"Replacing counters in group {group}")
        instances = { x: None for x in patts if x[2] == group }
        for i, instance in enumerate(instances):
            text = text.replace(instance, str(letters[i+1]))
    return text

def render_post(src):
    input_path = (ROOT / Path('../blog') / Path(src)).resolve()
    with open(input_path, 'r') as fin:
        with MathJaxRenderer() as renderer:
            content = renderer.render(Document(fin))
    content = replace_counters(content)
    content = replace_letters(content)
    return content


def lazy_images(content):
    """Lazy load every image but the first, which is likely above the fold."""
    count = itertools.count()
    def add_loading(match):
        tag = match.group(0)
        if next(count) == 0 or 'loading=' in tag:
            return tag
        return tag.replace('<img', '<img loading="lazy" decoding="async"', 1)
    return re.sub(r'<img\b[^>]*>', add_loading, content)


# Set MATHJAX=client to skip server-side rendering and ship the MathJax script
# instead (e.g. if node isn't available, or to debug a rendering difference).
PRERENDER_MATH = os.environ.get('MATHJAX', 'server') != 'client'


def prerender_math(html, name):
    """Typeset all the TeX in `html` to static CHTML with MathJax under Node.

    See mathjax-compile.mjs. Pages without math come back unchanged; TeX errors
    and undefined macros fail the build rather than shipping broken math.
    """
    logging.info(f"Prerendering math in {name} with MathJax.")
    result = subprocess.run(
        ['node', str(ROOT / 'mathjax-compile.mjs')],
        input=html,
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    if result.returncode != 0:
        raise RuntimeError(f"MathJax prerendering failed for {name}:\n{result.stderr}")
    return result.stdout


def process_post(template_file, post, force=False):
    src = post['src']
    input_path = (ROOT / Path('../blog') / Path(src)).resolve()
    output_path = input_path.with_suffix('.html')

    # Rebuild if the post, the template, or the math renderer changed.
    deps = [input_path, template_file, ROOT / 'mathjax-compile.mjs']
    newest_dep = max(os.path.getmtime(p) for p in deps)
    if not force and os.path.exists(output_path) and newest_dep < os.path.getmtime(output_path):
        # appears to not have been updated, skip
        logging.debug(f"Skipping {post['title']}")
        return
    else:
        logging.debug(f"Compiling {post['title']}")

    post['content'] = lazy_images(render_post(src))
    post['prerender_math'] = PRERENDER_MATH
    html = render_template(template_file, post)
    if PRERENDER_MATH:
        html = prerender_math(html, src)
    with open(output_path, 'w') as f:
        f.write(html)

MATH_FONT_SRC = ROOT / 'node_modules/@mathjax/mathjax-newcm-font/chtml/woff2'
MATH_FONT_DIR = 'assets/mathjax/woff2'


def sync_math_fonts(blog_dir):
    """Self-host exactly the MathJax fonts the prerendered posts reference.

    Copies each referenced woff2 from the installed font package (refreshing it
    if the package was upgraded) and deletes any that no post uses anymore.
    """
    pattern = re.compile(re.escape(MATH_FONT_DIR) + r'/([\w.-]+\.woff2)')
    needed = set()
    for html in blog_dir.glob('*.html'):
        needed.update(pattern.findall(html.read_text()))
    dest = blog_dir / MATH_FONT_DIR
    dest.mkdir(parents=True, exist_ok=True)
    for name in sorted(needed):
        src, dst = MATH_FONT_SRC / name, dest / name
        if not dst.exists() or src.read_bytes() != dst.read_bytes():
            logging.info(f"Copying math font {name}")
            shutil.copyfile(src, dst)
    for stale in dest.glob('*.woff2'):
        if stale.name not in needed:
            logging.info(f"Removing unused math font {stale.name}")
            stale.unlink()


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

    if PRERENDER_MATH:
        sync_math_fonts((ROOT / Path('../blog')).resolve())

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

