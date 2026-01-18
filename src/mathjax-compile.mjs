#!/usr/bin/env node
/**
 * MathJax Server-Side Compilation Script (MathJax v4)
 *
 * Processes HTML files containing LaTeX math ($...$, $$...$$) and outputs
 * pre-rendered CHTML. This replaces the deprecated mathjax-node-page (mjpage).
 *
 * Uses linkedom for robust HTML parsing (tolerates malformed HTML).
 *
 * Usage: node mathjax-compile.mjs <input.html> [output.html]
 *        cat input.html | node mathjax-compile.mjs > output.html
 */

import MathJax from '@mathjax/src/source';
import {parseHTML as LINKEDOM} from 'linkedom';
import fs from 'node:fs';

// Read input file from argument or stdin
const inputFile = process.argv[2];
const outputFile = process.argv[3];

let htmlContent;
if (inputFile) {
  htmlContent = fs.readFileSync(inputFile, 'utf8');
} else {
  htmlContent = fs.readFileSync(0, 'utf8');
}

// Initialize MathJax with tex-chtml configuration using linkedom adaptor
await MathJax.init({
  LINKEDOM: LINKEDOM,  // Must be at config root level for linkedom adaptor
  loader: {
    load: ['input/tex', 'output/chtml', 'adaptors/linkedom'],
    paths: { mathjax: '@mathjax/src/bundle' }
  },
  options: {},
  startup: {
    typeset: true,
    document: htmlContent
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  chtml: {
    fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
  }
});

// Wait for MathJax to be ready
await MathJax.startup.promise;

// Get the adaptor and document
const adaptor = MathJax.startup.adaptor;
const document = MathJax.startup.document;

// Render all math
await document.renderPromise();

// Build the output
let output = adaptor.doctype(document.document);
output += adaptor.outerHTML(adaptor.root(document.document));

// Write output
if (outputFile) {
  fs.writeFileSync(outputFile, output);
} else {
  process.stdout.write(output);
}

// Signal completion
MathJax.done();
