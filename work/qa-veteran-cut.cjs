const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ROOT = 'outputs/TheLastLight';
const indexHtml = fs.readFileSync(`${ROOT}/index.html`, 'utf8');

class Classes {
  constructor(owner, names = []) { this.owner = owner; this.s = new Set(names); }
  add(...names) { names.forEach(name => this.s.add(name)); }
  remove(...names) { names.forEach(name => this.s.delete(name)); }
  contains(name) { return this.s.has(name); }
  toggle(name, on) {
    if (on === undefined) on = !this.s.has(name);
    on ? this.s.add(name) : this.s.delete(name);
    return on;
  }
}

class El {
  constructor(id = '', tag = 'DIV', documentRef = null) {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.ownerDocument = documentRef;
    this.children = [];
    this.dataset = {};
    this.style = { setProperty: (key, value) => { this.style[key] = value; } };
    this.classList = new Classes(this);
    this.listeners = {};
    this.open = false;
    this.disabled = false;
    this.hidden = false;
    this.checked = false;
    this.value = '';
    this.textContent = '';
    this._html = '';
    this.onclick = null;
  }
  set className(value) { this.classList = new Classes(this, String(value).split(/\s+/).filter(Boolean)); }
  get className() { return [...this.classList.s].join(' '); }
  set innerHTML(value) { this._html = String(value); this.children = []; }
  get innerHTML() { return this._html; }
  appendChild(child) { this.children.push(child); return child; }
  setAttribute(key, value) { this[key] = String(value); }
  removeAttribute(key) { delete this[key]; }
  addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
  dispatchEvent(event) {
    event.target ??= this;
    for (const fn of this.listeners[event.type] || []) fn(event);
    const handler = this[`on${event.type}`];
    if (typeof handler === 'function') handler(event);
    return true;
  }
  click() {
    if (this.disabled) return;
    this.focus();
    if (typeof this.onclick === 'function') this.onclick({ target: this, preventDefault() {} });
  }
  focus() { if (this.ownerDocument) this.ownerDocument.activeElement = this; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  closest(selector) { return selector === 'dialog' ? this._dialog || null : null; }
  matches(selector) {
    if (selector === 'button') return this.tagName === 'BUTTON';
    if (selector === 'select') return this.tagName === 'SELECT';
    if (selector === 'input[type="checkbox"]') return this.tagName === 'INPUT' && this.type === 'checkbox';
    if (selector === 'button,input[type="checkbox"]') return this.tagName === 'BUTTON' || (this.tagName === 'INPUT' && this.type === 'checkbox');
    return false;
  }
  querySelectorAll() { return this.children; }
}

const elementSpecs = [];
for (const match of indexHtml.matchAll(/<([a-z][\w-]*)\b[^>]*\bid="([^"]+)"[^>]*>/gi)) {
  elementSpecs.push({ tag: match[1], id: match[2], html: match[0] });
}
assert(elementSpecs.length > 50, 'index.html did not expose the expected game UI');

const document = {
  activeElement: null,
  _listeners: {},
  addEventListener(type, fn) { (this._listeners[type] ??= []).push(fn); },
  createElement(tag) { return new El('', tag, this); },
};
document.documentElement = new El('html', 'HTML', document);
document.body = new El('body', 'BODY', document);

const els = {};
for (const spec of elementSpecs) {
  const el = new El(spec.id, spec.tag, document);
  const classMatch = spec.html.match(/\bclass="([^"]*)"/i);
  if (classMatch) el.className = classMatch[1];
  const valueMatch = spec.html.match(/\bvalue="([^"]*)"/i);
  if (valueMatch) el.value = valueMatch[1];
  if (/\bchecked\b/i.test(spec.html)) el.checked = true;
  const typeMatch = spec.html.match(/\btype="([^"]*)"/i);
  if (typeMatch) el.type = typeMatch[1];
  els[spec.id] = el;
}

const requiredIds = [
  'title', 'game', 'locations', 'storyDialog', 'navigationDialog', 'navigationGrid',
  'puzzleDialog', 'echoHubDialog', 'deductionDialog', 'memoryDiveDialog',
  'conversationDialog', 'startDiveOrder', 'finishConversation', 'largeText',
];
for (const id of requiredIds) assert(els[id], `index.html missing #${id}`);

const tabs = [...indexHtml.matchAll(/<button\b[^>]*\bdata-tab="([^"]+)"[^>]*>/gi)].map(match => {
  const el = new El('', 'BUTTON', document);
  el.dataset.tab = match[1];
  return el;
});
assert(tabs.some(tab => tab.dataset.tab === 'navigation'), 'navigation journal tab missing');

const navButtons = [...indexHtml.matchAll(/<button\b[^>]*\bdata-nav-dir="([URDL])"[^>]*>/gi)].map(match => {
  const el = new El('', 'BUTTON', document);
  el.dataset.navDir = match[1];
  return el;
});
assert.strictEqual(navButtons.length, 4, 'four directional navigation controls required');

const dialogs = Object.values(els).filter(el => el.tagName === 'DIALOG');
const closeButtons = [...indexHtml.matchAll(/<button\b[^>]*\bclass="[^"]*\bclose\b[^"]*"[^>]*>/gi)].map(() => {
  const el = new El('', 'BUTTON', document);
  el._dialog = dialogs[0];
  return el;
});

document.querySelector = function querySelector(selector) {
  if (selector.startsWith('#')) {
    const id = selector.slice(1);
    return els[id] || (els[id] = new El(id, 'DIV', document));
  }
  if (selector === 'dialog[open]') return dialogs.find(dialog => dialog.open) || null;
  return null;
};
document.querySelectorAll = function querySelectorAll(selector) {
  if (selector === '.screen') return [els.title, els.game];
  if (selector === '.tabs button') return tabs;
  if (selector === 'dialog .close') return closeButtons;
  if (selector === 'dialog') return dialogs;
  if (selector === '[data-nav-dir]') return navButtons;
  if (selector === '#choices button') return els.choices.children;
  if (selector === '#deductionChoices button') return els.deductionChoices.children;
  if (selector === '#diveObjects button') return els.diveObjects.children;
  if (selector === '#puzzleBody .selected') return els.puzzleBody.children.filter(child => child.classList.contains('selected'));
  if (selector === '[data-tone]' || selector === '[data-word]' || selector === '[data-lens]') return [];
  return [];
};

els.title.classList.add('screen', 'active');
els.game.classList.add('screen');
els.textSpeed.value = '0';
els.instantTravel.checked = true;
els.muteSound.checked = true;

const store = new Map();
store.set('ll-textSpeed', '0');
store.set('ll-instantTravel', 'true');
store.set('ll-mute', 'true');
const localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(key, String(value)); },
  removeItem(key) { store.delete(key); },
};

const sandbox = {
  console,
  document,
  localStorage,
  navigator: { getGamepads: () => [] },
  requestAnimationFrame: () => 1,
  setInterval: () => 1,
  clearInterval() {},
  setTimeout(fn) { fn(); return 1; },
  clearTimeout() {},
  Date,
  Math,
  JSON,
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const expectedScripts = [
  'veteran-content.js',
  'navigation-levels.js',
  'night-conversations.js',
  'veteran-navigation-encounters.js',
  'veteran-climax.js',
  'game.js',
];
const actualScripts = [...indexHtml.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)].map(match => match[1]);
for (const script of expectedScripts) assert(actualScripts.includes(script), `index.html does not load ${script}`);
const ordered = expectedScripts.map(script => actualScripts.indexOf(script));
assert(ordered.every((value, index) => index === 0 || value > ordered[index - 1]), 'Veteran Cut script order is invalid');
for (const script of expectedScripts) {
  vm.runInContext(fs.readFileSync(`${ROOT}/${script}`, 'utf8'), sandbox, { filename: script });
}

function currentSave() {
  const raw = store.get('last-light-save-v2');
  assert(raw, 'save checkpoint is missing');
  return JSON.parse(raw);
}

function exhaustStory(choiceIndex = null) {
  let guard = 0;
  while (els.storyDialog.open && guard++ < 120) {
    if (els.choices.children.length) {
      let index = choiceIndex;
      if (index == null) {
        const save = currentSave();
        // Scene choices are [truth, mercy], daily reflections are [mercy, truth].
        // Keep this blind run balanced so the complete-path fourth ending is testable.
        index = save.pending ? (save.truth <= save.mercy ? 0 : 1) : (save.truth <= save.mercy ? 1 : 0);
      }
      const choice = els.choices.children[Math.min(index, els.choices.children.length - 1)];
      assert(choice, 'story choice missing');
      choice.click();
    } else {
      els.nextStory.click();
    }
  }
  assert(guard < 120, 'story loop did not terminate');
}

function simulateReturnToTitle() {
  for (const dialog of dialogs) dialog.close();
  els.game.classList.remove('active');
  els.title.classList.add('active');
}

function advanceToChoices(label) {
  let guard = 0;
  while (els.storyDialog.open && !els.choices.children.length && guard++ < 40) els.nextStory.click();
  assert(guard < 40, `${label}: story pages did not reach choices`);
  assert(els.storyDialog.open && els.choices.children.length, `${label}: choices missing`);
}

function balancedChoiceIndex(choices, save) {
  const wanted = save.truth <= save.mercy ? 'truth' : 'mercy';
  const index = choices.findIndex(choice => choice.stat === wanted);
  assert(index >= 0, `no ${wanted} choice available`);
  return index;
}

function assertOneStatApplied(before, after, stat, label) {
  assert.strictEqual(after[stat], before[stat] + 1, `${label}: selected ${stat} was not applied exactly once`);
  const other = stat === 'truth' ? 'mercy' : 'truth';
  assert.strictEqual(after[other], before[other], `${label}: unselected ${other} changed`);
}

function visitAvailableLocation(day, step) {
  const button = els.locations.children.find(child => child.classList.contains('available'));
  assert(button, `day ${day + 1}, location step ${step + 1}: no available location`);
  const id = button.dataset.id;
  button.click();
  return id;
}

const diveAnswers = [
  ['soup', 'cards', 'knot'],
  ['photo', 'ribbon', 'pen'],
  ['boot', 'star', 'note'],
  ['radio', 'towel', 'list'],
  ['report', 'ticket', 'class'],
  ['glass', 'wheel', 'jacket'],
  ['alarm', 'bread', 'postcard'],
];

// Accessibility: large text must scale the root rem context, not only body descendants.
els.largeText.checked = true;
els.largeText.onchange({ target: els.largeText });
assert(document.documentElement.classList.contains('large-text'), 'large text class was not applied to <html>');
assert(!document.body.classList.contains('large-text'), 'large text class incorrectly remained on <body>');

els.newGame.click();
if (els.newGameDialog.open) els.confirmNew.click();
exhaustStory();

const routeLog = [];
const encounterLog = [];
const stormLog = [];
let sceneResume = null;
let navigationResume = null;
let encounterResume = null;
let stormResume = null;

function processNavigationEncounters() {
  let outerGuard = 0;
  while (currentSave().navEncounterPending && outerGuard++ < 6) {
    let before = currentSave();
    const pending = before.navEncounterPending;
    const data = sandbox.NAVIGATION_ENCOUNTERS.find(entry => entry.day === before.day + 1 && entry.signalId === pending.signalId);
    assert(data, `day ${before.day + 1} ${pending.signalId}: encounter data missing`);
    const key = `${before.day}-${pending.signalId}`;
    const countBefore = Object.keys(before.navigationEncounters).length;

    assert.strictEqual(pending.choice, null, `${key}: fresh encounter unexpectedly had a choice`);
    advanceToChoices(`encounter ${key}`);
    before = currentSave();
    const choiceIndex = balancedChoiceIndex(data.choices, before);
    const selectedData = data.choices[choiceIndex];
    els.choices.children[choiceIndex].click();

    let selected = currentSave();
    assert(selected.navEncounterPending?.choice, `${key}: selection was not checkpointed`);
    assert.strictEqual(Object.keys(selected.navigationEncounters).length, countBefore, `${key}: encounter committed before result was read`);
    assert.strictEqual(selected.truth, before.truth, `${key}: truth changed before atomic commit`);
    assert.strictEqual(selected.mercy, before.mercy, `${key}: mercy changed before atomic commit`);

    let atomic = false;
    if (!encounterResume) {
      atomic = true;
      simulateReturnToTitle();
      els.continueGame.click();
      const resumed = currentSave();
      assert(els.storyDialog.open, `${key}: selected encounter did not resume to its result`);
      assert(resumed.navEncounterPending?.choice, `${key}: selected encounter choice was lost on resume`);
      assert.strictEqual(resumed.truth, before.truth, `${key}: truth changed during encounter resume`);
      assert.strictEqual(resumed.mercy, before.mercy, `${key}: mercy changed during encounter resume`);
      encounterResume = { day: before.day + 1, signalId: pending.signalId, stat: selectedData.stat };
    }

    let commitGuard = 0;
    while (Object.keys(currentSave().navigationEncounters).length === countBefore && commitGuard++ < 20) {
      assert(els.storyDialog.open, `${key}: result closed without committing encounter`);
      els.nextStory.click();
    }
    assert(commitGuard < 20, `${key}: encounter result did not commit`);
    const after = currentSave();
    assert(after.navigationEncounters[key], `${key}: committed encounter record missing`);
    assertOneStatApplied(before, after, selectedData.stat, `encounter ${key}`);
    encounterLog.push({ day: before.day + 1, signalId: pending.signalId, choiceId: selectedData.id, stat: selectedData.stat, atomicResume: atomic });
  }
  assert(outerGuard < 6, 'navigation encounter chain did not terminate');
}

for (let day = 0; day < 7; day++) {
  let selectedEchoes = 0;
  let capProbeDone = false;

  for (let step = 0; step < 6; step++) {
    const locationId = visitAvailableLocation(day, step);

    if (locationId === 'lighthouse') {
      assert(els.navigationDialog.open, `day ${day + 1}: lighthouse did not open navigation`);
      const level = sandbox.NAVIGATION_LEVELS.levels[day];
      assert(level?.minimalSolution, `day ${day + 1}: minimalSolution missing`);
      const solution = [...level.minimalSolution];
      for (const dir of solution) {
        assert(els.navigationDialog.open, `day ${day + 1}: navigation closed before command ${dir}`);
        navButtons.find(button => button.dataset.navDir === dir).click();
        processNavigationEncounters();

        if (day === 0 && !navigationResume && els.navigationDialog.open) {
          const interrupted = currentSave();
          const progress = interrupted.navigationProgress['0'];
          assert(progress?.moves > 0, 'navigation progress did not save a manual move');
          const savedPos = progress.pos.join(',');
          simulateReturnToTitle();
          els.continueGame.click();
          assert(els.navigationDialog.open, 'interrupted navigation did not resume');
          const resumed = currentSave().navigationProgress['0'];
          assert.strictEqual(resumed.moves, progress.moves, 'resumed navigation duplicated or lost moves');
          assert.strictEqual(resumed.pos.join(','), savedPos, 'resumed navigation position changed');
          navigationResume = { moves: progress.moves, pos: savedPos };
        }
      }
      assert(!els.navigationDialog.open, `day ${day + 1}: minimalSolution did not complete navigation`);
      assert(els.storyDialog.open, `day ${day + 1}: navigation debrief missing`);
      exhaustStory();
      assert(els.puzzleDialog.open, `day ${day + 1}: lighthouse scene did not reach signal puzzle`);

      const navSave = currentSave();
      const navLog = navSave.navigationLogs[String(day)];
      assert(navLog, `day ${day + 1}: navigation log missing`);
      assert.strictEqual(navLog.assisted, false, `day ${day + 1}: navigation was incorrectly marked assisted`);
      assert.strictEqual(navLog.moves, solution.length, `day ${day + 1}: manual route move count differs from minimalSolution`);
      routeLog.push({ day: day + 1, moves: navLog.moves, limit: navLog.limit, assisted: navLog.assisted });

      // The requested signal-puzzle help should solve without granting the no-help listener achievement.
      els.puzzleAssist.click();
      assert(els.echoHubDialog.open, `day ${day + 1}: post-puzzle echo hub missing`);
    } else {
      assert(els.storyDialog.open, `day ${day + 1} ${locationId}: scene did not open`);

      if (day === 0 && step === 0) {
        els.nextStory.click();
        const interrupted = currentSave();
        assert(interrupted.pending, 'interrupted scene did not persist pending state');
        const pendingPage = interrupted.pending.page;
        simulateReturnToTitle();
        els.continueGame.click();
        assert(els.storyDialog.open, 'interrupted scene did not resume');
        assert.strictEqual(currentSave().pending.page, pendingPage, 'resumed scene page changed');
        sceneResume = { loc: interrupted.pending.loc, page: pendingPage };
      }

      exhaustStory();

      if (selectedEchoes < 2) {
        const done = els.locations.children.find(child => child.dataset.id === locationId);
        assert(done?.classList.contains('afterimage'), `day ${day + 1} ${locationId}: optional afterimage not offered`);
        done.click();
        assert(els.storyDialog.open, `day ${day + 1} ${locationId}: afterimage story missing`);
        exhaustStory();
        selectedEchoes++;
        assert.strictEqual(Object.keys(currentSave().afterimages).filter(key => key.startsWith(`${day}-`)).length, selectedEchoes, `day ${day + 1}: afterimage count drifted`);
      } else if (!capProbeDone) {
        const before = Object.keys(currentSave().afterimages).length;
        const done = els.locations.children.find(child => child.dataset.id === locationId);
        assert(!done.classList.contains('afterimage'), `day ${day + 1}: third afterimage remained visually available`);
        done.click();
        exhaustStory();
        assert.strictEqual(Object.keys(currentSave().afterimages).length, before, `day ${day + 1}: third afterimage bypassed daily cap`);
        capProbeDone = true;
      }
    }
  }

  assert.strictEqual(selectedEchoes, 2, `day ${day + 1}: did not select exactly two afterimages`);
  assert(els.echoHubDialog.open, `day ${day + 1}: echo hub not open before deduction`);
  els.startDeduction.click();
  assert(els.deductionDialog.open, `day ${day + 1}: deduction did not open`);
  els.deductionAssist.click();
  assert(els.memoryDiveDialog.open, `day ${day + 1}: memory dive did not open`);

  for (const objectButton of [...els.diveObjects.children]) objectButton.click();
  assert(!els.startDiveOrder.disabled, `day ${day + 1}: observation did not unlock ordering`);
  assert(els.diveObjects.children.every(button => !button.classList.contains('chosen')), `day ${day + 1}: observation prematurely created an order`);
  els.startDiveOrder.click();
  assert(!els.checkDive.disabled, `day ${day + 1}: ordering check remained disabled`);
  for (const objectId of diveAnswers[day]) {
    const button = els.diveObjects.children.find(child => child.dataset.object === objectId);
    assert(button, `day ${day + 1}: missing memory object ${objectId}`);
    button.click();
  }
  els.checkDive.click();
  assert(els.conversationDialog.open, `day ${day + 1}: night conversation did not open`);

  // Pick one person, read all three main questions, then one question from the
  // second person's departing voice.
  assert.strictEqual(els.conversationChoices.children.length, 2, `day ${day + 1}: expected two conversation partners`);
  els.conversationChoices.children[0].click();
  assert.strictEqual(els.conversationChoices.children.length, 3, `day ${day + 1}: expected three questions`);
  for (let question = 0; question < 3; question++) {
    const button = els.conversationChoices.children[question];
    assert(button?.tagName === 'BUTTON' && !button.disabled, `day ${day + 1}: main question ${question + 1} unavailable`);
    button.click();
  }
  let conversationSave = currentSave();
  assert.strictEqual(conversationSave.conversations[String(day)].asked.length, 3, `day ${day + 1}: main conversation did not record three questions`);
  assert(els.finishConversation.hidden, `day ${day + 1}: conversation finished before auxiliary question`);
  const auxiliaryData = sandbox.NIGHT_CONVERSATIONS[day].choices[1];
  const wantedAuxStat = conversationSave.truth <= conversationSave.mercy ? 'truth' : 'mercy';
  const auxiliaryIndex = auxiliaryData.questions.findIndex(question => question.stat === wantedAuxStat);
  assert(auxiliaryIndex >= 0, `day ${day + 1}: no balancing auxiliary question`);
  const enabledAuxiliary = els.conversationChoices.children.filter(child => child.tagName === 'BUTTON' && !child.disabled);
  assert.strictEqual(enabledAuxiliary.length, 3, `day ${day + 1}: expected three auxiliary questions`);
  enabledAuxiliary[auxiliaryIndex].click();
  conversationSave = currentSave();
  assert(conversationSave.conversations[String(day)].auxiliaryAsked, `day ${day + 1}: auxiliary question was not recorded`);
  assert(!els.finishConversation.hidden, `day ${day + 1}: conversation finish did not unlock after 3+1 questions`);
  assert(els.conversationChoices.children.filter(child => child.tagName === 'BUTTON').every(button => button.disabled), `day ${day + 1}: an extra conversation question remained available`);
  els.finishConversation.click();

  if (day < 6) {
    assert(els.storyDialog.open, `day ${day + 1}: daily reflection did not open`);
    exhaustStory();
    assert.strictEqual(currentSave().day, day + 1, `day ${day + 1}: reflection did not advance the day`);
  }
}

assert(els.storyDialog.open, 'storm climax did not open after day seven');
for (let stageIndex = 0; stageIndex < sandbox.VETERAN_CLIMAX.length; stageIndex++) {
  const stage = sandbox.VETERAN_CLIMAX[stageIndex];
  let before = currentSave();
  assert.strictEqual(before.storm.stage, stageIndex, `storm stage ${stageIndex + 1}: wrong checkpoint stage`);
  assert.strictEqual(before.storm.decisions.length, stageIndex, `storm stage ${stageIndex + 1}: decision count drifted`);
  assert.strictEqual(before.storm.pending, null, `storm stage ${stageIndex + 1}: unexpected pending choice`);
  advanceToChoices(`storm stage ${stageIndex + 1}`);
  before = currentSave();
  const choiceIndex = balancedChoiceIndex(stage.choices, before);
  const selectedData = stage.choices[choiceIndex];
  els.choices.children[choiceIndex].click();

  let selected = currentSave();
  assert(selected.storm.pending, `storm stage ${stageIndex + 1}: choice was not checkpointed`);
  assert.strictEqual(selected.storm.decisions.length, stageIndex, `storm stage ${stageIndex + 1}: decision committed before result`);
  assert.strictEqual(selected.truth, before.truth, `storm stage ${stageIndex + 1}: truth changed before atomic commit`);
  assert.strictEqual(selected.mercy, before.mercy, `storm stage ${stageIndex + 1}: mercy changed before atomic commit`);

  let atomic = false;
  if (!stormResume) {
    atomic = true;
    simulateReturnToTitle();
    els.continueGame.click();
    const resumed = currentSave();
    assert(els.storyDialog.open, 'selected storm choice did not resume to its result');
    assert(resumed.storm.pending, 'selected storm choice was lost on resume');
    assert.strictEqual(resumed.truth, before.truth, 'truth changed during storm-choice resume');
    assert.strictEqual(resumed.mercy, before.mercy, 'mercy changed during storm-choice resume');
    stormResume = { stage: stageIndex + 1, stageId: stage.id, stat: selectedData.stat };
  }

  let commitGuard = 0;
  while (currentSave().storm.decisions.length === stageIndex && commitGuard++ < 20) {
    assert(els.storyDialog.open, `storm stage ${stageIndex + 1}: result closed without commit`);
    els.nextStory.click();
  }
  assert(commitGuard < 20, `storm stage ${stageIndex + 1}: result did not commit`);
  const after = currentSave();
  assertOneStatApplied(before, after, selectedData.stat, `storm stage ${stageIndex + 1}`);
  stormLog.push({ stage: stageIndex + 1, stageId: stage.id, choiceId: selectedData.id, stat: selectedData.stat, atomicResume: atomic });
}

assert(currentSave().storm.completed, 'five storm decisions did not complete the climax');
assert(currentSave().achievements.helmsman, 'helmsman achievement missing after five storm decisions');
assert(els.storyDialog.open, 'storm summary did not open');
let finalChoiceGuard = 0;
while (els.storyDialog.open && !els.choices.children.length && finalChoiceGuard++ < 20) els.nextStory.click();
assert(finalChoiceGuard < 20, 'final choice pages did not reach choices');
assert.strictEqual(els.choices.children.length, 4, `balanced complete run did not expose four endings (truth=${currentSave().truth}, mercy=${currentSave().mercy})`);
exhaustStory(3);

const final = currentSave();
assert.strictEqual(Object.keys(final.visited).length, 42, 'full run did not visit all 42 scenes');
assert.strictEqual(Object.keys(final.afterimages).length, 14, 'full run did not stop at 14 selected afterimages');
assert.strictEqual(Object.values(final.navigationDone).filter(Boolean).length, 7, 'seven navigations not completed');
assert.strictEqual(Object.keys(final.navigationLogs).length, 7, 'seven navigation logs not saved');
assert(Object.values(final.navigationLogs).every(log => log.assisted === false), 'an assisted navigation leaked into the run');
assert.strictEqual(Object.keys(final.navigationEncounters).length, 14, 'fourteen navigation encounters not completed');
assert.strictEqual(Object.values(final.conversations).filter(conversation => conversation.done).length, 7, 'seven night conversations not completed');
assert(Object.values(final.conversations).every(conversation => conversation.asked.length === 3 && conversation.auxiliaryAsked), 'night conversation did not enforce 3+1 questions');
assert.strictEqual(final.storm.decisions.length, 5, 'five storm decisions not completed');
assert(final.storm.completed, 'storm completion flag missing');
assert.strictEqual(Object.keys(final.puzzleDone).length, 7, 'seven signal puzzles not completed');
assert.strictEqual(Object.keys(final.deductions).length, 7, 'seven deductions not completed');
assert.strictEqual(Object.keys(final.dives).length, 7, 'seven memory dives not completed');
assert.strictEqual(final.assists, 14, 'assist count should contain seven signal and seven deduction assists only');
assert(final.achievements.navigator, 'navigator achievement missing');
assert(final.achievements.confidant, 'confidant achievement missing');
assert(final.achievements.helmsman, 'helmsman achievement missing');
assert(final.achievements.echoes, '14-afterimage achievement missing');
assert(!final.achievements.listener, 'signal-puzzle help incorrectly granted no-help achievement');
assert(final.endingsSeen.includes('dawn'), 'hidden dawn ending not completed');
assert(final.atFinalChoice, 'ending did not restore the final-choice checkpoint');
assert(sceneResume, 'scene interruption/resume test did not run');
assert(navigationResume, 'navigation interruption/resume test did not run');
assert(encounterResume, 'encounter-choice interruption/resume test did not run');
assert(stormResume, 'storm-choice interruption/resume test did not run');

console.log(JSON.stringify({
  ok: true,
  scripts: expectedScripts,
  fullRun: {
    days: 7,
    scenes: Object.keys(final.visited).length,
    afterimages: Object.keys(final.afterimages).length,
    navigations: Object.values(final.navigationDone).filter(Boolean).length,
    navigationEncounters: Object.keys(final.navigationEncounters).length,
    conversations: Object.values(final.conversations).filter(conversation => conversation.done).length,
    stormDecisions: final.storm.decisions.length,
    puzzles: Object.keys(final.puzzleDone).length,
    deductions: Object.keys(final.deductions).length,
    dives: Object.keys(final.dives).length,
    assists: final.assists,
    ending: final.endingsSeen.at(-1),
    truth: final.truth,
    mercy: final.mercy,
  },
  routeLog,
  encounterLog,
  stormLog,
  resume: { scene: sceneResume, navigation: navigationResume, encounter: encounterResume, storm: stormResume },
  accessibility: {
    rootLargeText: document.documentElement.classList.contains('large-text'),
    bodyLargeText: document.body.classList.contains('large-text'),
  },
  achievements: {
    navigator: Boolean(final.achievements.navigator),
    confidant: Boolean(final.achievements.confidant),
    helmsman: Boolean(final.achievements.helmsman),
    echoes: Boolean(final.achievements.echoes),
    listenerWithoutHelp: Boolean(final.achievements.listener),
  },
}, null, 2));
