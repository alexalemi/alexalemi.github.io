"""
Provides MathJax support for rendering Markdown with LaTeX to html.
"""

from mistletoe.html_renderer import HTMLRenderer
from mistletoe.latex_renderer import LaTeXRenderer

class MathJaxRenderer(HTMLRenderer, LaTeXRenderer):
    """
    MRO will first look for render functions under HTMLRenderer,
    then LaTeXRenderer.
    """

    def render_math(self, token):
        """
        Ensure Math tokens are all enclosed in two dollar signs.
        """
        if token.content.startswith('$$'):
            return self.render_raw_text(token)
        return '{}'.format(self.render_raw_text(token))

