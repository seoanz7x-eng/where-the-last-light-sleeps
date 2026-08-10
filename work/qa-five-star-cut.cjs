const fs = require('fs');
const path = require('path');

/*
 * The Five-Star Cut keeps the Veteran Cut's full virtual-DOM playthrough as
 * its regression base, then applies narrowly-scoped test extensions. Keeping
 * the shared traversal in one source prevents the two full-run harnesses from
 * silently drifting while the Five-Star-only contracts remain explicit here.
 */
const basePath = path.join(__dirname, 'qa-veteran-cut.cjs');
let source = fs.readFileSync(basePath, 'utf8');

function replaceOnce(needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0) throw new Error(`Five-Star QA patch anchor missing: ${label}`);
  if (source.indexOf(needle, first + needle.length) >= 0) {
    throw new Error(`Five-Star QA patch anchor is ambiguous: ${label}`);
  }
  source = source.slice(0, first) + replacement + source.slice(first + needle.length);
}

function replaceRange(startNeedle, endNeedle, replacement, label) {
  const start = source.indexOf(startNeedle);
  if (start < 0) throw new Error(`Five-Star QA range start missing: ${label}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`Five-Star QA range end missing: ${label}`);
  source = source.slice(0, start) + replacement + source.slice(end);
}

replaceOnce(
  "  'conversationDialog', 'startDiveOrder', 'finishConversation', 'largeText',\n];",
  "  'conversationDialog', 'startDiveOrder', 'finishConversation', 'largeText',\n" +
    "  'musicVolume', 'ambienceVolume', 'effectsVolume', 'soundCaptions',\n" +
    "  'reduceFlashes', 'cinematicIntensity', 'cinematicFx', 'soundCaption', 'sceneCue',\n" +
    "];",
  'Five-Star settings IDs',
);

replaceOnce(
  "  'veteran-climax.js',\n  'game.js',",
  "  'veteran-climax.js',\n" +
    "  'five-star-content.js',\n" +
    "  'sensory-engine.js',\n" +
    "  'game.js',",
  'Five-Star script order',
);

replaceOnce(
  "const actualScripts = [...indexHtml.matchAll(/<script\\b[^>]*\\bsrc=\"([^\"]+)\"[^>]*>/gi)].map(match => match[1]);\n" +
    "for (const script of expectedScripts) assert(actualScripts.includes(script), `index.html does not load ${script}`);\n" +
    "const ordered = expectedScripts.map(script => actualScripts.indexOf(script));\n" +
    "assert(ordered.every((value, index) => index === 0 || value > ordered[index - 1]), 'Veteran Cut script order is invalid');\n" +
    "for (const script of expectedScripts) {\n" +
    "  vm.runInContext(fs.readFileSync(`${ROOT}/${script}`, 'utf8'), sandbox, { filename: script });\n" +
    "}\n",
  "const actualScripts = [...indexHtml.matchAll(/<script\\b[^>]*\\bsrc=\"([^\"]+)\"[^>]*>/gi)].map(match => match[1]);\n" +
    "assert(actualScripts.includes('language-loader.js'), 'index.html does not load language-loader.js');\n" +
    "const qaLanguage = process.env.TLL_QA_LANGUAGE === 'en' ? 'en' : 'ko';\n" +
    "const scriptsToRun = expectedScripts.map(script => qaLanguage === 'en' ? script.replace(/\\.js$/, '.en.js') : script);\n" +
    "for (const script of scriptsToRun) {\n" +
    "  assert(fs.existsSync(`${ROOT}/${script}`), `localized script is missing: ${script}`);\n" +
    "  vm.runInContext(fs.readFileSync(`${ROOT}/${script}`, 'utf8'), sandbox, { filename: script });\n" +
    "}\n",
  'localized script loading',
);

replaceOnce(
  "for (const script of scriptsToRun) {\n" +
    "  assert(fs.existsSync(`${ROOT}/${script}`), `localized script is missing: ${script}`);\n" +
    "  vm.runInContext(fs.readFileSync(`${ROOT}/${script}`, 'utf8'), sandbox, { filename: script });\n" +
    "}\n",
  "for (const script of scriptsToRun) {\n" +
    "  assert(fs.existsSync(`${ROOT}/${script}`), `localized script is missing: ${script}`);\n" +
    "  vm.runInContext(fs.readFileSync(`${ROOT}/${script}`, 'utf8'), sandbox, { filename: script });\n" +
    "}\n\n" +
    "const fiveStarData = sandbox.FIVE_STAR_UPGRADE;\n" +
    "assert(fiveStarData, 'Five-Star content did not expose FIVE_STAR_UPGRADE');\n" +
    "assert(sandbox.LastLightSensory, 'sensory-engine.js did not expose LastLightSensory');\n" +
    "assert.strictEqual(sandbox.AudioContext, undefined, 'deterministic QA must not provide AudioContext');\n" +
    "assert.strictEqual(Object.keys(fiveStarData.ripples).length, 28, 'expected 28 choice-to-ripple mappings');\n" +
    "assert.strictEqual(fiveStarData.broadcast.length, 4, 'expected four final-broadcast stages');\n" +
    "assert.strictEqual(Object.keys(fiveStarData.stormOutcomes).length, 15, 'expected 15 storm outcome mappings');\n" +
    "const encounterChoiceIds = sandbox.NAVIGATION_ENCOUNTERS.flatMap(encounter => encounter.choices.map(choice => choice.id));\n" +
    "assert.strictEqual(new Set(encounterChoiceIds).size, 28, 'navigation encounters must expose 28 unique choices');\n" +
    "assert(encounterChoiceIds.every(id => fiveStarData.ripples[id]), 'every navigation choice needs a ripple mapping');\n" +
    "const stormFlags = sandbox.VETERAN_CLIMAX.flatMap(stage => stage.choices.map(choice => choice.flag)).filter(Boolean);\n" +
    "assert.strictEqual(new Set(stormFlags).size, 15, 'storm climax must expose 15 unique outcome flags');\n" +
    "assert(stormFlags.every(flag => fiveStarData.stormOutcomes[flag]), 'every storm flag needs an outcome mapping');\n",
  'Five-Star static content contracts',
);

replaceOnce(
  "      assert.strictEqual(navLog.moves, solution.length, `day ${day + 1}: manual route move count differs from minimalSolution`);\n" +
    "      routeLog.push({ day: day + 1, moves: navLog.moves, limit: navLog.limit, assisted: navLog.assisted });",
  "      assert.strictEqual(navLog.moves, solution.length, `day ${day + 1}: manual route move count differs from minimalSolution`);\n" +
    "      const previousChoiceIds = encounterLog.filter(entry => entry.day === day).map(entry => entry.choiceId);\n" +
    "      const expectedEffects = previousChoiceIds.map(id => fiveStarData.ripples[id]);\n" +
    "      const expectedBonus = Math.min(2, expectedEffects.filter(effect => effect.effect === 'fuel').length);\n" +
    "      const expectedLabels = expectedEffects.map(effect => effect.effectLabel).sort();\n" +
    "      assert.strictEqual(navLog.baseLimit, level.moveLimit, `day ${day + 1}: navigation base limit drifted`);\n" +
    "      assert.strictEqual(navLog.limit, level.moveLimit + expectedBonus, `day ${day + 1}: consequence fuel bonus was not applied`);\n" +
    "      assert.strictEqual(JSON.stringify([...(navLog.consequences || [])].sort()), JSON.stringify(expectedLabels), `day ${day + 1}: navigation consequence log differs from prior choices`);\n" +
    "      assert.strictEqual((navLog.consequences || []).length, day === 0 ? 0 : 2, `day ${day + 1}: expected two prior-choice navigation consequences`);\n" +
    "      routeLog.push({ day: day + 1, moves: navLog.moves, limit: navLog.limit, baseLimit: navLog.baseLimit, consequenceBonus: expectedBonus, consequences: navLog.consequences, assisted: navLog.assisted });",
  'navigation ripple effects',
);

replaceOnce(
  "    exhaustStory();\n" +
    "    assert.strictEqual(currentSave().day, day + 1, `day ${day + 1}: reflection did not advance the day`);",
  "    exhaustStory();\n" +
    "    assert.strictEqual(currentSave().day, day + 1, `day ${day + 1}: reflection did not advance the day`);\n" +
    "    const expectedRippleCount = Math.min((day + 1) * 2, 12);\n" +
    "    assert.strictEqual(Object.keys(currentSave().ripplesSeen).length, expectedRippleCount, `day ${day + 1}: next-day ripple stories were not fully processed`);",
  'next-day ripple traversal',
);

const oldBroadcastStart = "assert(els.storyDialog.open, 'storm summary did not open');";
const oldBroadcastEnd = "const final = currentSave();";
const broadcastBlock =
  "assert(els.storyDialog.open, 'storm summary did not open');\n" +
  "const broadcastLog = [];\n" +
  "let broadcastResume = null;\n" +
  "for (let stageIndex = 0; stageIndex < fiveStarData.broadcast.length; stageIndex++) {\n" +
  "  const stage = fiveStarData.broadcast[stageIndex];\n" +
  "  let reachGuard = 0;\n" +
  "  while (els.storyDialog.open && !els.choices.children.length && reachGuard++ < 80) els.nextStory.click();\n" +
  "  assert(reachGuard < 80, `broadcast stage ${stageIndex + 1}: pages did not reach choices`);\n" +
  "  let before = currentSave();\n" +
  "  assert.strictEqual(before.broadcast.stage, stageIndex, `broadcast stage ${stageIndex + 1}: wrong checkpoint stage`);\n" +
  "  assert.strictEqual(before.broadcast.decisions.length, stageIndex, `broadcast stage ${stageIndex + 1}: decision count drifted`);\n" +
  "  assert.strictEqual(before.broadcast.pending, null, `broadcast stage ${stageIndex + 1}: unexpected pending choice`);\n" +
  "  assert.strictEqual(els.choices.children.length, 3, `broadcast stage ${stageIndex + 1}: expected three choices`);\n" +
  "  const choiceIndex = balancedChoiceIndex(stage.choices, before);\n" +
  "  const selectedData = stage.choices[choiceIndex];\n" +
  "  els.choices.children[choiceIndex].click();\n\n" +
  "  let selected = currentSave();\n" +
  "  assert(selected.broadcast.pending, `broadcast stage ${stageIndex + 1}: choice was not checkpointed`);\n" +
  "  assert.strictEqual(selected.broadcast.decisions.length, stageIndex, `broadcast stage ${stageIndex + 1}: decision committed before result`);\n" +
  "  assert.strictEqual(selected.truth, before.truth, `broadcast stage ${stageIndex + 1}: truth changed before atomic commit`);\n" +
  "  assert.strictEqual(selected.mercy, before.mercy, `broadcast stage ${stageIndex + 1}: mercy changed before atomic commit`);\n\n" +
  "  let atomic = false;\n" +
  "  if (!broadcastResume) {\n" +
  "    atomic = true;\n" +
  "    simulateReturnToTitle();\n" +
  "    els.continueGame.click();\n" +
  "    const resumed = currentSave();\n" +
  "    assert(els.storyDialog.open, 'selected broadcast choice did not resume to its result');\n" +
  "    assert(resumed.broadcast.pending, 'selected broadcast choice was lost on resume');\n" +
  "    assert.strictEqual(resumed.broadcast.decisions.length, stageIndex, 'broadcast decision committed during resume');\n" +
  "    assert.strictEqual(resumed.truth, before.truth, 'truth changed during broadcast-choice resume');\n" +
  "    assert.strictEqual(resumed.mercy, before.mercy, 'mercy changed during broadcast-choice resume');\n" +
  "    broadcastResume = { stage: stageIndex + 1, stageId: stage.id, stat: selectedData.stat };\n" +
  "  }\n\n" +
  "  let commitGuard = 0;\n" +
  "  while (currentSave().broadcast.decisions.length === stageIndex && commitGuard++ < 30) {\n" +
  "    assert(els.storyDialog.open, `broadcast stage ${stageIndex + 1}: result closed without commit`);\n" +
  "    els.nextStory.click();\n" +
  "  }\n" +
  "  assert(commitGuard < 30, `broadcast stage ${stageIndex + 1}: result did not commit`);\n" +
  "  const after = currentSave();\n" +
  "  assertOneStatApplied(before, after, selectedData.stat, `broadcast stage ${stageIndex + 1}`);\n" +
  "  assert.strictEqual(after.broadcast.decisions[stageIndex].line, selectedData.line, `broadcast stage ${stageIndex + 1}: transcript line drifted`);\n" +
  "  broadcastLog.push({ stage: stageIndex + 1, stageId: stage.id, choiceId: selectedData.id, stat: selectedData.stat, atomicResume: atomic });\n" +
  "}\n\n" +
  "const broadcastComplete = currentSave();\n" +
  "assert(broadcastComplete.broadcast.completed, 'four broadcast decisions did not complete the final broadcast');\n" +
  "assert.strictEqual(broadcastComplete.broadcast.decisions.length, 4, 'final broadcast decision count must be four');\n" +
  "assert(broadcastComplete.achievements.broadcaster, 'broadcaster achievement missing');\n" +
  "assert(els.storyDialog.open, 'final broadcast summary did not open');\n" +
  "let finalChoiceGuard = 0;\n" +
  "while (els.storyDialog.open && !els.choices.children.length && finalChoiceGuard++ < 80) els.nextStory.click();\n" +
  "assert(finalChoiceGuard < 80, 'final broadcast summary did not reach final choices');\n" +
  "assert.strictEqual(els.choices.children.length, 4, `balanced complete run did not expose four endings (truth=${currentSave().truth}, mercy=${currentSave().mercy})`);\n" +
  "exhaustStory(3);\n\n";
replaceRange(oldBroadcastStart, oldBroadcastEnd, broadcastBlock, 'final broadcast traversal');

replaceOnce(
  "assert.strictEqual(final.storm.decisions.length, 5, 'five storm decisions not completed');\n" +
    "assert(final.storm.completed, 'storm completion flag missing');",
  "assert.strictEqual(final.storm.decisions.length, 5, 'five storm decisions not completed');\n" +
    "assert(final.storm.completed, 'storm completion flag missing');\n" +
    "assert.strictEqual(Object.keys(final.ripplesSeen).length, 14, 'six next-day transitions plus the final storm transition must resolve fourteen ripples');\n" +
    "assert(final.achievements.ripples, 'fourteen-ripple achievement missing');\n" +
    "assert.strictEqual(final.broadcast.decisions.length, 4, 'four final-broadcast decisions not completed');\n" +
    "assert(final.broadcast.completed, 'final broadcast completion flag missing');\n" +
    "assert(final.achievements.broadcaster, 'broadcaster achievement missing after final broadcast');\n" +
    "assert.strictEqual(Object.values(final.navigationLogs).flatMap(log => log.consequences || []).length, 12, 'navigation logs must retain twelve returned consequences');",
  'Five-Star final-state assertions',
);

replaceOnce(
  "    stormDecisions: final.storm.decisions.length,\n" +
    "    puzzles: Object.keys(final.puzzleDone).length,",
  "    stormDecisions: final.storm.decisions.length,\n" +
    "    ripplesSeen: Object.keys(final.ripplesSeen).length,\n" +
    "    broadcastDecisions: final.broadcast.decisions.length,\n" +
    "    puzzles: Object.keys(final.puzzleDone).length,",
  'Five-Star completion output',
);

replaceOnce(
  "  stormLog,\n" +
    "  resume: { scene: sceneResume, navigation: navigationResume, encounter: encounterResume, storm: stormResume },",
  "  stormLog,\n" +
    "  broadcastLog,\n" +
    "  resume: { scene: sceneResume, navigation: navigationResume, encounter: encounterResume, storm: stormResume, broadcast: broadcastResume },",
  'Five-Star broadcast output',
);

const run = new Function('require', '__filename', '__dirname', source);
run(require, __filename, __dirname);
