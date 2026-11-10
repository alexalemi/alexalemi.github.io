#!/usr/bin/env node
/**
 * MathJax Server-Side Compilation Script (MathJax v4)
 *
 * Processes HTML containing LaTeX math ($...$, $$...$$, \(...\), \[...\]) and
 * outputs pre-rendered CHTML, so readers don't need to download or run MathJax.
 *
 * - Pages with no math are passed through byte-for-byte unchanged.
 * - Assistive MathML is included so screen readers can still read the math.
 * - Fonts are self-hosted, copied from the installed font package at build
 *   time, so the CSS we emit can never drift out of sync with the font files.
 * - Any TeX error (undefined macro, bad syntax) fails the build instead of
 *   silently shipping red error text.
 *
 * Usage: node mathjax-compile.mjs <input.html> [output.html]
 *        cat input.html | node mathjax-compile.mjs > output.html
 */

import MathJax from '@mathjax/src/source';
import {parseHTML as LINKEDOM} from 'linkedom';
import fs from 'node:fs';

// Fonts are self-hosted: compile.py copies the woff2 files the posts reference
// from node_modules into blog/assets/mathjax/woff2 (relative to the posts).
const FONT_URL = process.env.MATHJAX_FONT_URL || 'assets/mathjax/woff2';

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const htmlContent = fs.readFileSync(inputFile || 0, 'utf8');

function emit(text) {
  if (outputFile) {
    fs.writeFileSync(outputFile, text);
  } else {
    process.stdout.write(text);
  }
}

const texErrors = [];

await MathJax.init({
  LINKEDOM: LINKEDOM,  // Must be at config root level for linkedom adaptor
  loader: {
    load: ['input/tex', 'output/chtml', 'adaptors/linkedom', 'a11y/assistive-mml'],
    paths: { mathjax: '@mathjax/src/bundle' }
  },
  // NB: no `options` block. When one is present, the assistive-mml component
  // injects menu settings that are invalid without ui/menu loaded, and init
  // fails. Assistive MathML is enabled by default once the component loads.
  startup: {
    typeset: false,
    document: htmlContent
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    formatError(jax, err) {
      texErrors.push(err.message);
      return jax.formatError(err);
    }
  },
  chtml: {
    fontURL: FONT_URL
  }
});

await MathJax.startup.promise;

const adaptor = MathJax.startup.adaptor;
const document = MathJax.startup.document;

// Work around a MathJax/linkedom bug: the assistive-mml extension parses a bare
// `<math>...</math>` fragment and expects it in <body>, but linkedom treats the
// first tag of an unwrapped fragment as the root element, so body is empty and
// MathJax crashes. Wrap fragments in <html><body> so they land where expected.
const parseDocument = adaptor.parse.bind(adaptor);
adaptor.parse = (text, format = 'text/html') =>
  /^\s*<(!doctype|html)/i.test(text)
    ? parseDocument(text, format)
    : parseDocument(`<html><body>${text}</body></html>`, format);

await document.renderPromise();

// Undefined macros don't raise errors: the `noundefined` package renders them
// as red text (e.g. a red "\foo"). Catch those too.
for (const item of document.math) {
  const mml = document.toMML(item.root);
  for (const [, name] of mml.matchAll(/<mtext mathcolor="red"[^>]*>(\\[^<]*)<\/mtext>/g)) {
    texErrors.push(`Undefined control sequence ${name} in: ${item.math.slice(0, 80)}`);
  }
}

if (texErrors.length) {
  for (const msg of texErrors) console.error(`TeX error: ${msg}`);
  process.exit(1);
}

if (Array.from(document.math).length === 0) {
  // No math: don't re-serialize (and don't inject the MathJax stylesheet).
  emit(htmlContent);
} else {
  let output = adaptor.doctype(document.document);
  output += adaptor.outerHTML(adaptor.root(document.document));
  emit(output);
}

MathJax.done();
