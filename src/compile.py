import glob
import jinja2
import json
import logging
import os


logging.basicConfig(level=logging.DEBUG)

ROOT = os.path.dirname(os.path.realpath(__file__))
TEMPLATES = '../templates/index.tpl'
DATA_PATH = '../data'
BUILD_PATH = '..'


def load_data(pattern):
    logging.info(f"Loading data from {pattern}.")
    data = {}
    for data_file in glob.glob(pattern):
        logging.debug(f"Reading {data_file}...")
        filename = os.path.splitext(os.path.split(data_file)[1])[0]
        with open(data_file, 'r') as f:
            data[filename] = json.load(f)

    return data


def compile_template(template_path, data, output_path):
    logging.debug(f"Compiling {template_path} to {output_path}...")
    template_path = os.path.abspath(template_path)

    env = jinja2.environment.Environment(
        loader=jinja2.FileSystemLoader(os.path.dirname(template_path)))

    template = env.get_template(os.path.basename(template_path))

    with open(output_path, 'w') as f:
        f.write(template.render(**data))


if __name__ == '__main__':
    logging.debug("Compiling..")
    for template_file in glob.glob(os.path.join(ROOT, TEMPLATES)):
        filename = os.path.splitext(os.path.split(template_file)[1])[0]
        compile_template(
            template_file,
            load_data(os.path.join(ROOT, DATA_PATH, '*.json')),
            os.path.join(ROOT, BUILD_PATH, '{}.html'.format(filename)),
        )
