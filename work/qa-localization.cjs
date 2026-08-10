'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

const root = path.resolve('outputs/TheLastLight');
const baseFiles = [
  'veteran-content.js', 'navigation-levels.js', 'night-conversations.js',
  'veteran-navigation-encounters.js', 'veteran-climax.js', 'five-star-content.js',
  'sensory-engine.js', 'game.js'
];
const hangul = /[가-힣]/;
let englishStrings = 0;

for (const baseFile of baseFiles) {
  const file = baseFile.replace(/\.js$/, '.en.js');
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
  walk.simple(ast, {
    Literal(node) {
      if (typeof node.value !== 'string') return;
      englishStrings += 1;
      assert(!hangul.test(node.value), `${file} retains Korean in a runtime string: ${node.value.slice(0, 100)}`);
    },
    TemplateElement(node) {
      englishStrings += 1;
      assert(!hangul.test(node.value.cooked), `${file} retains Korean in a template string: ${node.value.cooked.slice(0, 100)}`);
    }
  });
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'language-loader.js'), 'utf8');
assert(html.includes('<html lang="en">'), 'English must be the document default');
assert(html.includes('<title>Where the Last Light Sleeps</title>'), 'English title is missing');
assert(html.includes('id="languageSelect"'), 'language selector is missing');
assert(html.includes('<option value="en" selected>English</option>'), 'English is not the visible default');
assert(html.includes('<option value="ko">한국어</option>'), 'Korean option is missing');
assert(html.includes('<script src="language-loader.js"></script>'), 'language loader is not referenced');
assert(!baseFiles.some(file => html.includes(`src="${file}"`)), 'index.html bypasses the language loader');
assert(loader.includes("localStorage.getItem('lastLight.language') || 'en'"), 'stored language does not default to English');
assert(loader.includes("language === 'en' ? name.replace(/\\.js$/, '.en.js') : name"), 'loader does not switch source sets');
assert(loader.includes('window.localizeRuntimeValue'), 'save-language migration hook is missing');

console.log(JSON.stringify({
  ok: true,
  defaultLanguage: 'en',
  alternateLanguage: 'ko',
  localizedFiles: baseFiles.length,
  checkedRuntimeStrings: englishStrings,
  languageSelector: 'pass',
  saveMigrationHook: 'pass'
}, null, 2));
