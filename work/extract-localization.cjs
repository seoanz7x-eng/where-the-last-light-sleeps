'use strict';

const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

const root = path.resolve(__dirname, '..');
const gameDir = path.join(root, 'outputs', 'TheLastLight');
const sourceFiles = [
  'veteran-content.js',
  'navigation-levels.js',
  'night-conversations.js',
  'veteran-navigation-encounters.js',
  'veteran-climax.js',
  'five-star-content.js',
  'sensory-engine.js',
  'game.js'
];
const hangul = /[가-힣]/;
const refs = new Map();

function record(text, file, kind, start, end) {
  if (!hangul.test(text)) return;
  if (!refs.has(text)) refs.set(text, []);
  refs.get(text).push({ file, kind, start, end });
}

for (const file of sourceFiles) {
  const source = fs.readFileSync(path.join(gameDir, file), 'utf8');
  const ast = acorn.parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'script',
    allowHashBang: true
  });
  walk.simple(ast, {
    Literal(node) {
      if (typeof node.value === 'string') record(node.value, file, 'literal', node.start, node.end);
    },
    TemplateElement(node) {
      record(node.value.cooked, file, 'template', node.start, node.end);
    }
  });
}

const htmlFile = 'index.html';
const htmlSource = fs.readFileSync(path.join(gameDir, htmlFile), 'utf8');
for (const match of htmlSource.matchAll(/>([^<>]*[가-힣][^<>]*)</g)) {
  const value = match[1].trim();
  if (value) record(value, htmlFile, 'html-text', match.index + 1, match.index + 1 + match[1].length);
}
for (const match of htmlSource.matchAll(/\b(aria-label|title|alt)=(['"])([^'"]*[가-힣][^'"]*)\2/g)) {
  record(match[3], htmlFile, 'html-attribute', match.index, match.index + match[0].length);
}

const strings = [...refs.entries()]
  .sort((a, b) => a[0].localeCompare(b[0], 'ko'))
  .map(([source, references], id) => ({ id, source, references }));
const outDir = path.join(root, 'work', 'localization');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'strings.json'), `${JSON.stringify({ sourceLanguage: 'ko', targetLanguage: 'en', count: strings.length, strings }, null, 2)}\n`);

const byFile = Object.fromEntries([...sourceFiles, htmlFile].map(file => [file, strings.filter(item => item.references.some(ref => ref.file === file)).length]));
console.log(JSON.stringify({ count: strings.length, byFile }, null, 2));
