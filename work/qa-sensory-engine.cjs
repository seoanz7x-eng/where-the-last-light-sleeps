const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const ENGINE_PATH = 'outputs/TheLastLight/sensory-engine.js';
const source = fs.readFileSync(ENGINE_PATH, 'utf8');

class FakeAudioParam {
  constructor(name, value = 0) {
    this.name = name;
    this.value = value;
    this.history = [value];
  }

  _record(value) {
    assert(Number.isFinite(value), `${this.name} received a non-finite value`);
    this.value = value;
    this.history.push(value);
  }

  cancelAndHoldAtTime() {}
  cancelScheduledValues() {}
  setValueAtTime(value) { this._record(value); }
  setTargetAtTime(value) { this._record(value); }
  exponentialRampToValueAtTime(value) { this._record(value); }
  linearRampToValueAtTime(value) { this._record(value); }
}

class FakeNode {
  constructor(context, kind) {
    this.context = context;
    this.kind = kind;
    this.connections = [];
  }

  connect(destination) {
    this.connections.push(destination);
    return destination;
  }
}

class FakeGain extends FakeNode {
  constructor(context) {
    super(context, 'gain');
    this.gain = new FakeAudioParam('gain', 1);
  }
}

class FakeCompressor extends FakeNode {
  constructor(context) {
    super(context, 'compressor');
    this.threshold = new FakeAudioParam('threshold', -24);
    this.knee = new FakeAudioParam('knee', 30);
    this.ratio = new FakeAudioParam('ratio', 12);
    this.attack = new FakeAudioParam('attack', 0.003);
    this.release = new FakeAudioParam('release', 0.25);
  }
}

class FakeOscillator extends FakeNode {
  constructor(context) {
    super(context, 'oscillator');
    this.type = 'sine';
    this.frequency = new FakeAudioParam('frequency', 440);
    this.started = false;
    this.stopped = false;
  }

  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class FakeBiquadFilter extends FakeNode {
  constructor(context) {
    super(context, 'biquad');
    this.type = 'lowpass';
    this.frequency = new FakeAudioParam('frequency', 350);
    this.Q = new FakeAudioParam('Q', 1);
  }
}

class FakeConvolver extends FakeNode {
  constructor(context) {
    super(context, 'convolver');
    this.buffer = null;
  }
}

class FakeAudioBuffer {
  constructor(channels, length, sampleRate) {
    this.numberOfChannels = channels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.channels = Array.from({ length: channels }, () => new Float32Array(length));
  }

  getChannelData(channel) {
    return this.channels[channel];
  }

  copyToChannel(data, channel, offset = 0) {
    this.channels[channel].set(data.subarray(0, this.length - offset), offset);
  }
}

class FakeBufferSource extends FakeNode {
  constructor(context) {
    super(context, 'buffer-source');
    this.buffer = null;
    this.loop = false;
    this.started = false;
    this.stopped = false;
  }

  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class FakeAudioContext {
  static instances = [];

  constructor() {
    this.sampleRate = 8000;
    this.currentTime = 0;
    this.state = 'suspended';
    this.destination = new FakeNode(this, 'destination');
    this.gains = [];
    this.oscillators = [];
    this.bufferSources = [];
    this.filters = [];
    this.compressors = [];
    FakeAudioContext.instances.push(this);
  }

  createGain() {
    const node = new FakeGain(this);
    this.gains.push(node);
    return node;
  }

  createDynamicsCompressor() {
    const node = new FakeCompressor(this);
    this.compressors.push(node);
    return node;
  }

  createOscillator() {
    const node = new FakeOscillator(this);
    this.oscillators.push(node);
    return node;
  }

  createBiquadFilter() {
    const node = new FakeBiquadFilter(this);
    this.filters.push(node);
    return node;
  }

  createConvolver() {
    return new FakeConvolver(this);
  }

  createBuffer(channels, length, sampleRate) {
    return new FakeAudioBuffer(channels, length, sampleRate);
  }

  createBufferSource() {
    const node = new FakeBufferSource(this);
    this.bufferSources.push(node);
    return node;
  }

  async resume() {
    this.state = 'running';
  }

  async suspend() {
    this.state = 'suspended';
  }
}

function createDom() {
  const cinematicFx = { dataset: {} };
  const soundCaption = { dataset: {}, textContent: '' };
  const listeners = {};
  const document = {
    hidden: false,
    querySelector(selector) {
      if (selector === '#cinematicFx') return cinematicFx;
      if (selector === '#soundCaption') return soundCaption;
      return null;
    },
    addEventListener(type, handler) {
      (listeners[type] ||= []).push(handler);
    },
  };
  return { document, cinematicFx, soundCaption, listeners };
}

function createSandbox({ withAudio = true, withDom = true } = {}) {
  const dom = withDom ? createDom() : null;
  const timers = new Map();
  let timerId = 0;
  const sandbox = {
    console,
    Promise,
    Math,
    Float32Array,
    setTimeout(fn, delay) {
      const id = ++timerId;
      timers.set(id, { fn, delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  if (withAudio) sandbox.AudioContext = FakeAudioContext;
  if (withDom) sandbox.document = dom.document;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: ENGINE_PATH });
  return { sandbox, api: sandbox.LastLightSensory, dom, timers };
}

function assertGainValuesBounded(context) {
  for (const node of context.gains) {
    for (const value of node.gain.history) {
      assert(
        Number.isFinite(value) && value >= 0 && value <= 1,
        `gain escaped [0, 1]: ${value}`,
      );
    }
  }
}

async function testSupportedAudio() {
  FakeAudioContext.instances.length = 0;
  const { api, dom } = createSandbox();
  const required = [
    'create', 'resume', 'setScene', 'setStory', 'cue',
    'finale', 'configure', 'setMuted', 'suspend', 'deactivate',
  ];
  for (const method of required) {
    assert.strictEqual(typeof api[method], 'function', `missing API method ${method}`);
  }

  const engine = api.create({
    settings: {
      masterVolume: 55,
      musicVolume: 48,
      ambienceVolume: 62,
      sfxVolume: 70,
      captions: true,
      cinematicIntensity: 'full',
    },
  });
  assert.strictEqual(FakeAudioContext.instances.length, 0, 'audio should remain lazy before resume');
  assert.strictEqual(await api.resume(), true, 'resume should start supported audio');
  assert.strictEqual(FakeAudioContext.instances.length, 1, 'singleton created more than one context');

  const context = FakeAudioContext.instances[0];
  assert.strictEqual(context.state, 'running');
  assert(engine.nodes.musicBus, 'music bus missing');
  assert(engine.nodes.ambienceBus, 'ambience bus missing');
  assert(engine.nodes.sfxBus, 'sfx bus missing');
  assert.notStrictEqual(engine.nodes.musicBus, engine.nodes.ambienceBus);
  assert.notStrictEqual(engine.nodes.musicBus, engine.nodes.sfxBus);
  assert.notStrictEqual(engine.nodes.ambienceBus, engine.nodes.sfxBus);
  assert(engine.nodes.musicBus.connections.includes(engine.nodes.compressor), 'music bus is not routed');
  assert(engine.nodes.ambienceBus.connections.includes(engine.nodes.compressor), 'ambience bus is not routed');
  assert(engine.nodes.sfxBus.connections.includes(engine.nodes.compressor), 'sfx bus is not routed');

  const same = api.create({ musicVolume: 33 });
  assert.strictEqual(same, engine, 'create should reuse the singleton');
  assert.strictEqual(await api.resume(), true);
  assert.strictEqual(FakeAudioContext.instances.length, 1, 'repeated create/resume multiplied contexts');

  const permanentOscillators = context.oscillators.length;
  const permanentLoopingNoise = context.bufferSources.filter(node => node.loop && !node.stopped).length;
  assert.strictEqual(permanentOscillators, 3, 'expected three long-lived oscillators');
  assert.strictEqual(permanentLoopingNoise, 1, 'expected one long-lived looping noise source');

  const scenes = [
    { day: 0, location: 'harbor', phase: 'map' },
    { day: 2, location: 'orchard', phase: 'story' },
    { day: 4, location: 'cliff', phase: 'navigation' },
    { day: 6, location: 'storm', phase: 'storm' },
    { day: 99, location: 'lighthouse', phase: 'final-choice' },
  ];
  for (let iteration = 0; iteration < 8; iteration++) {
    for (const scene of scenes) api.setScene(scene);
  }
  assert.strictEqual(context.oscillators.length, permanentOscillators, 'scene changes multiplied oscillators');
  assert.strictEqual(
    context.bufferSources.filter(node => node.loop && !node.stopped).length,
    permanentLoopingNoise,
    'scene changes multiplied looping ambience',
  );
  assert.strictEqual(dom.cinematicFx.dataset.location, 'lighthouse');
  assert.strictEqual(dom.cinematicFx.dataset.phase, 'final-choice');
  assert.strictEqual(dom.cinematicFx.dataset.day, '6', 'visual day should be clamped');

  api.setStory({ speaker: '미라', title: '폭풍의 대가', page: 3, choiceMode: true });
  assert.strictEqual(dom.cinematicFx.dataset.speaker, 'mira');
  assert.strictEqual(dom.cinematicFx.dataset.storyMood, 'storm');
  assert.strictEqual(dom.cinematicFx.dataset.choiceMode, 'true');
  assert.strictEqual(dom.cinematicFx.dataset.page, '3');

  api.configure({
    masterVolume: 500,
    musicVolume: -10,
    ambienceVolume: 42,
    sfxVolume: 2,
    captions: true,
    reduceFlashes: true,
    cinematicIntensity: 'subtle',
  });
  assert.strictEqual(engine.settings.master, 1);
  assert.strictEqual(engine.settings.music, 0);
  assert.strictEqual(engine.settings.ambience, 0.42);
  assert.strictEqual(engine.settings.sfx, 0.02);
  assert.strictEqual(dom.cinematicFx.dataset.intensity, 'subtle');
  assert.strictEqual(dom.cinematicFx.dataset.reduceFlashes, 'true');

  const activeLoopsBeforeCues =
    context.oscillators.filter(node => node.started && !node.stopped).length +
    context.bufferSources.filter(node => node.started && !node.stopped).length;
  for (const cue of ['step', 'choice', 'clue', 'solve', 'wrong', 'tone', 'signal', 'bell', 'wave', 'impact', 'thunder', 'page']) {
    assert.strictEqual(api.cue(cue, { index: 50 }), true, `${cue} cue failed`);
  }
  assert.strictEqual(api.finale('release'), true);
  assert.strictEqual(api.finale('stars'), true);
  assert.strictEqual(api.finale('remain'), true);
  assert.strictEqual(api.finale('dawn'), true);
  const activeLoopsAfterCues =
    context.oscillators.filter(node => node.started && !node.stopped).length +
    context.bufferSources.filter(node => node.started && !node.stopped).length;
  assert.strictEqual(activeLoopsAfterCues, activeLoopsBeforeCues, 'transient cues leaked long-lived sources');
  assert(dom.soundCaption.textContent.length > 0, 'sound caption did not update');
  assert.strictEqual(dom.soundCaption.dataset.visible, 'true');
  assert.strictEqual(dom.cinematicFx.dataset.phase, 'finale');
  assert.strictEqual(dom.cinematicFx.dataset.mood, 'dawn');
  assert(Number(dom.cinematicFx.dataset.cueToken) > 0, 'visual cue token did not update');

  assertGainValuesBounded(context);

  const nodeCountBeforeMute = context.oscillators.length + context.bufferSources.length;
  api.setMuted(true);
  assert.strictEqual(engine.muted, true);
  assert.strictEqual(context.state, 'suspended');
  assert.strictEqual(api.cue('choice'), false, 'muted cue should not create audio');
  assert.strictEqual(
    context.oscillators.length + context.bufferSources.length,
    nodeCountBeforeMute,
    'muted cue created nodes',
  );
  api.setMuted(false);
  assert.strictEqual(await api.resume(), true);
  assert.strictEqual(await api.deactivate(), true);
  assert.strictEqual(engine.started, false, 'deactivate must prevent visibility-driven title-screen resume');
  assert.strictEqual(context.state, 'suspended');
  assert.strictEqual(await api.resume(), true);
  assert.strictEqual(await api.suspend(), true);
  assert.strictEqual(context.state, 'suspended');
  assert.strictEqual(FakeAudioContext.instances.length, 1, 'mute cycle multiplied contexts');
}

async function testNoAudioFallback() {
  const { api } = createSandbox({ withAudio: false, withDom: false });
  assert.doesNotThrow(() => api.create());
  assert.strictEqual(await api.resume(), false);
  assert.doesNotThrow(() => api.configure({
    musicVolume: 120,
    ambienceVolume: -4,
    captions: true,
  }));
  assert.doesNotThrow(() => api.setScene({ day: 6, location: 'storm', phase: 'storm' }));
  assert.doesNotThrow(() => api.setStory({ speaker: '미라', title: '마지막 빛', page: 1 }));
  assert.strictEqual(api.cue('thunder'), false);
  assert.strictEqual(api.finale('dawn'), false);
  assert.doesNotThrow(() => api.setMuted(true));
  assert.strictEqual(await api.suspend(), false);
}

(async () => {
  await testSupportedAudio();
  await testNoAudioFallback();
  console.log(JSON.stringify({
    ok: true,
    suite: 'sensory-engine',
    singletonContexts: 1,
    buses: ['music', 'ambience', 'sfx'],
    longLivedSources: { oscillators: 3, loopingNoise: 1 },
    fallback: 'pass',
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
