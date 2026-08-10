const fs = require('fs');
const data = JSON.parse(fs.readFileSync('work/navigation-levels.json', 'utf8'));
const output = `/* Generated from work/navigation-levels.json. */\n'use strict';\nwindow.NAVIGATION_LEVELS = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync('outputs/TheLastLight/navigation-levels.js', output, 'utf8');
console.log(`wrote ${data.levels.length} navigation levels`);
