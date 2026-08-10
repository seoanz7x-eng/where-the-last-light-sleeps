'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '..');
const localizationDir = path.join(root, 'work', 'localization');
const input = JSON.parse(fs.readFileSync(path.join(localizationDir, 'strings.json'), 'utf8'));
const cachePath = path.join(localizationDir, 'translations.en.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const hangul = /[가-힣]/;
const separator = '\nZXQTRANSLATIONSEPARATORZX\n';
const glossary = [
  ['세이렌호', 'ZXSHIPZX', 'the Siren'],
  ['세이렌 섬', 'ZXISLANDZX', 'Siren Island'],
  ['세이렌 등대', 'ZXLIGHTHOUSEZX', 'the Siren Lighthouse'],
  ['미라 벨', 'ZXMIRABELLZX', 'Mira Bell'],
  ['마레나 벨', 'ZXMARENABELLZX', 'Marena Bell'],
  ['로웬', 'ZXROWANZX', 'Rowan'],
  ['아델', 'ZXADELEZX', 'Adele'],
  ['노아', 'ZXNOAHZX', 'Noah'],
  ['마레', 'ZXMAREZX', 'Mare'],
  ['이솔', 'ZXISOLZX', 'Isol'],
  ['라온', 'ZXRAONZX', 'Raon'],
  ['미라', 'ZXMIRAZX', 'Mira']
];

function protect(text) {
  return glossary.reduce((value, [ko, token]) => value.split(ko).join(token), text);
}

function restore(text) {
  return glossary.reduce((value, [, token, en]) => value.split(token).join(en), text)
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/“\s+/g, '“')
    .replace(/\s+”/g, '”');
}

function requestTranslation(text) {
  const body = new URLSearchParams({ q: text }).toString();
  const options = {
    hostname: 'translate.googleapis.com',
    path: '/translate_a/single?client=gtx&sl=ko&tl=en&dt=t',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Content-Length': Buffer.byteLength(body),
      'User-Agent': 'TheLastLight-Localization/1.0'
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(`Translate HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        try {
          const parsed = JSON.parse(data);
          resolve((parsed[0] || []).map(part => part[0] || '').join(''));
        } catch (error) {
          reject(new Error(`Invalid translate response: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Translate request timed out')));
    req.end(body);
  });
}

function save() {
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

async function translateBatch(items) {
  const joined = items.map(item => protect(item.source)).join(separator);
  const translated = await requestTranslation(joined);
  const pieces = translated.split(/\s*ZXQTRANSLATIONSEPARATORZX\s*/);
  if (pieces.length !== items.length) {
    for (const item of items) cache[item.source] = restore(await requestTranslation(protect(item.source)));
    return;
  }
  pieces.forEach((piece, index) => { cache[items[index].source] = restore(piece.trim()); });
}

function createBatches(items) {
  const batches = [];
  let current = [];
  let chars = 0;
  for (const item of items) {
    if (current.length && (current.length >= 16 || chars + item.source.length > 3600)) {
      batches.push(current);
      current = [];
      chars = 0;
    }
    current.push(item);
    chars += item.source.length + separator.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

(async () => {
  const pending = input.strings.filter(item => typeof cache[item.source] !== 'string' || !cache[item.source].trim() || hangul.test(cache[item.source]));
  pending.forEach(item => { delete cache[item.source]; });
  const batches = pending.length < 100 ? pending.map(item => [item]) : createBatches(pending);
  console.log(`Translating ${pending.length} strings in ${batches.length} batches...`);
  for (let index = 0; index < batches.length; index += 1) {
    let lastError;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        await translateBatch(batches[index]);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, attempt * 750));
      }
    }
    if (lastError) throw lastError;
    if ((index + 1) % 5 === 0 || index === batches.length - 1) {
      save();
      console.log(`${index + 1}/${batches.length} batches complete`);
    }
  }
  save();
  console.log(`Saved ${Object.keys(cache).length} translations to ${cachePath}`);
})().catch(error => {
  save();
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
