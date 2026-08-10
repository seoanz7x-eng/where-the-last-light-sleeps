const fs = require('fs');

const source = fs.readFileSync('work/narrative-veteran-cut.md', 'utf8');

function extract(start, end) {
  const a = source.indexOf(start);
  if (a < 0) throw new Error(`Missing start marker: ${start}`);
  const b = source.indexOf(end, a);
  if (b < 0) throw new Error(`Missing end marker after: ${start}`);
  return source.slice(a, b + end.length);
}

const rewrites = extract('const delayedRevealRewrites = [', '\n];')
  .replace('const delayedRevealRewrites', 'window.VETERAN_DELAYED_REWRITES');
const branches = extract('const branchReactionsByDay = {', '\n};')
  .replace('const branchReactionsByDay', 'window.VETERAN_BRANCH_REACTIONS');
const endings = extract('const veteranEndingCopy = {', '\n};')
  .replace('const veteranEndingCopy', 'window.VETERAN_ENDINGS');

const output = `/* Generated from work/narrative-veteran-cut.md. */\n'use strict';\n${rewrites}\n\n${branches}\n\n${endings}\n`;
fs.writeFileSync('outputs/TheLastLight/veteran-content.js', output, 'utf8');
console.log(`wrote ${output.length} chars`);
