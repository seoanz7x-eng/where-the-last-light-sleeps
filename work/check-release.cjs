const fs = require('fs');
const path = require('path');

const root = path.resolve('outputs/TheLastLight');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const refs = [
  ...[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]),
  ...[...css.matchAll(/url\(['"]?([^'")]+)/g)].map(m => m[1]),
].filter(ref => !/^(?:data:|https?:|#|%23)/.test(ref));
const unique = [...new Set(refs)].sort();
const missing = unique.filter(ref => !fs.existsSync(path.join(root, ref)));
const required = [
  'game.js', 'veteran-content.js', 'navigation-levels.js', 'night-conversations.js',
  'veteran-navigation-encounters.js', 'veteran-climax.js', 'five-star-content.js',
  'sensory-engine.js', 'game.en.js', 'veteran-content.en.js', 'navigation-levels.en.js',
  'night-conversations.en.js', 'veteran-navigation-encounters.en.js', 'veteran-climax.en.js',
  'five-star-content.en.js', 'sensory-engine.en.js', 'language-loader.js', 'index.ko.html',
  'styles.css', 'index.html', 'README.md',
  'REVIEW-ANALYSIS.md', 'QA-RESULTS.json', 'PLAY.cmd',
];
const missingRequired = required.filter(ref => !fs.existsSync(path.join(root, ref)));
const qa = JSON.parse(fs.readFileSync(path.join(root, 'QA-RESULTS.json'), 'utf8'));
const result = {
  ok: missing.length === 0
    && missingRequired.length === 0
    && qa.automated_regression === 'pass'
    && qa.sensory_regression === 'pass'
    && qa.navigation_bfs === 'pass',
  referencedFiles: unique.length,
  missing,
  missingRequired,
  build: qa.build,
  regression: qa.automated_regression,
};
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
