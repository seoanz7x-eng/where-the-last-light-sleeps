(() => {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const doc = typeof document !== 'undefined' ? document : null;
  const AudioContextCtor = root.AudioContext || root.webkitAudioContext || null;
  const EPSILON = 0.0001;

  const DEFAULTS = Object.freeze({
    master: 0.55,
    music: 0.52,
    ambience: 0.64,
    sfx: 0.7,
    muted: false,
    ducking: true,
    cinematicIntensity: 'full',
    reduceFlashes: false,
    captions: false,
  });

  const LOCATION_PROFILES = Object.freeze({
    harbor: {
      root: 98,
      interval: 1.5,
      pad: 0.034,
      overtone: 0.014,
      wind: 0.018,
      windFrequency: 720,
      sea: 0.055,
      seaFrequency: 260,
      pulse: 0.008,
      pulseRate: 0.12,
      reverb: 0.13,
      mood: 'harbor',
    },
    village: {
      root: 110,
      interval: 1.498,
      pad: 0.038,
      overtone: 0.012,
      wind: 0.013,
      windFrequency: 920,
      sea: 0.026,
      seaFrequency: 310,
      pulse: 0.012,
      pulseRate: 0.18,
      reverb: 0.1,
      mood: 'village',
    },
    orchard: {
      root: 123.47,
      interval: 1.587,
      pad: 0.032,
      overtone: 0.02,
      wind: 0.016,
      windFrequency: 1320,
      sea: 0.014,
      seaFrequency: 380,
      pulse: 0.006,
      pulseRate: 0.23,
      reverb: 0.24,
      mood: 'orchard',
    },
    chapel: {
      root: 87.31,
      interval: 1.5,
      pad: 0.04,
      overtone: 0.014,
      wind: 0.01,
      windFrequency: 560,
      sea: 0.034,
      seaFrequency: 210,
      pulse: 0.013,
      pulseRate: 0.15,
      reverb: 0.34,
      mood: 'chapel',
    },
    cliff: {
      root: 82.41,
      interval: 1.414,
      pad: 0.028,
      overtone: 0.011,
      wind: 0.072,
      windFrequency: 1160,
      sea: 0.022,
      seaFrequency: 240,
      pulse: 0.005,
      pulseRate: 0.11,
      reverb: 0.18,
      mood: 'cliff',
    },
    lighthouse: {
      root: 130.81,
      interval: 1.5,
      pad: 0.043,
      overtone: 0.016,
      wind: 0.022,
      windFrequency: 680,
      sea: 0.03,
      seaFrequency: 230,
      pulse: 0.02,
      pulseRate: 0.42,
      reverb: 0.29,
      mood: 'lighthouse',
    },
    storm: {
      root: 73.42,
      interval: 1.414,
      pad: 0.045,
      overtone: 0.018,
      wind: 0.105,
      windFrequency: 920,
      sea: 0.07,
      seaFrequency: 180,
      pulse: 0.032,
      pulseRate: 0.58,
      reverb: 0.22,
      mood: 'storm',
    },
  });

  const DAY_TENSION = Object.freeze([0.86, 0.92, 0.98, 1.04, 1.13, 1.22, 1.34]);
  const DAY_TUNING = Object.freeze([1, 1.0293, 0.9709, 0.9439, 0.917, 0.8909, 1.0595]);

  const CAPTIONS = Object.freeze({
    step: "The sound of low footsteps spreads across the wet road.",
    travel: "Wind and waves flow in the direction of movement.",
    choice: "A short bell notes the choice.",
    clue: "A clear glass sound announces a new record.",
    solve: "Overlapping notes are resolved into one chord.",
    wrong: "A harsh noise cuts out low.",
    tone: "A short beep sounds.",
    signal: "A radio signal comes back from the distant sea.",
    bell: "A bell in the water leaves a long lingering scent.",
    wave: "Big waves pass under the hull.",
    impact: "The floor trembles with a dull impact sound.",
    thunder: "Distant thunder cracks in the storm.",
    page: "The paper turns over quietly.",
    finale: "The melody of the last light slowly rises.",
  });

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  function normalizeVolume(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return clamp(number > 1 ? number / 100 : number);
  }

  function normalizeIntensity(value) {
    return ['off', 'subtle', 'full'].includes(value) ? value : DEFAULTS.cinematicIntensity;
  }

  function slug(value) {
    const text = String(value || '').trim().toLowerCase();
    const known = {
      미라: 'mira',
      로웬: 'rowen',
      아델: 'adele',
      노아: 'noah',
      마레: 'mare',
      이솔: 'isol',
    };
    const person = Object.keys(known).find(name => text.startsWith(name));
    if (person) return known[person];
    return text
      .normalize('NFKD')
      .replace(/[^\w-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'none';
  }

  function ramp(param, value, context, seconds = 0.12) {
    if (!param || !context) return;
    const target = Math.max(EPSILON, Number(value) || EPSILON);
    const now = context.currentTime;
    try {
      if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(now);
      else {
        param.cancelScheduledValues(now);
        param.setValueAtTime(Math.max(EPSILON, param.value || EPSILON), now);
      }
      param.setTargetAtTime(target, now, Math.max(0.01, seconds));
    } catch {
      try {
        param.value = target;
      } catch {}
    }
  }

  function seededNoise(length, seed = 0x51a7e) {
    const data = new Float32Array(length);
    let value = seed >>> 0;
    for (let i = 0; i < length; i++) {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      data[i] = (value / 0xffffffff) * 2 - 1;
    }
    return data;
  }

  class SensoryEngine {
    constructor(options = {}) {
      this.contextCtor = options.AudioContext || AudioContextCtor;
      this.context = null;
      this.supported = !!this.contextCtor;
      this.started = false;
      this.muted = DEFAULTS.muted;
      this.settings = { ...DEFAULTS };
      this.scene = { day: 0, location: 'harbor', phase: 'map' };
      this.story = { speaker: '', title: '', page: 0, choiceMode: false };
      this.nodes = null;
      this.cueToken = 0;
      this.captionTimer = 0;
      this.fxTimer = 0;
      this.fx = doc?.querySelector?.('#cinematicFx') || null;
      this.caption = doc?.querySelector?.('#soundCaption') || null;
      this.configure(options.settings || options);
      this._syncVisualSettings();
      this._bindVisibility();
    }

    _bindVisibility() {
      if (!doc?.addEventListener) return;
      this.visibilityHandler = () => {
        if (doc.hidden) this.suspend();
        else if (this.started && !this.muted) this.resume();
      };
      doc.addEventListener('visibilitychange', this.visibilityHandler);
    }

    _ensureAudio() {
      if (this.context || !this.supported || this.muted) return !!this.context;
      try {
        const context = new this.contextCtor();
        const master = context.createGain();
        const compressor = context.createDynamicsCompressor();
        const musicBus = context.createGain();
        const ambienceBus = context.createGain();
        const sfxBus = context.createGain();
        const reverb = context.createConvolver();
        const reverbGain = context.createGain();

        compressor.threshold.value = -19;
        compressor.knee.value = 18;
        compressor.ratio.value = 5;
        compressor.attack.value = 0.008;
        compressor.release.value = 0.28;

        musicBus.connect(compressor);
        ambienceBus.connect(compressor);
        sfxBus.connect(compressor);
        musicBus.connect(reverb);
        ambienceBus.connect(reverb);
        reverb.connect(reverbGain);
        reverbGain.connect(compressor);
        compressor.connect(master);
        master.connect(context.destination);

        reverb.buffer = this._createImpulse(context, 2.4, 2.9);

        const pad = context.createOscillator();
        const overtone = context.createOscillator();
        const pulse = context.createOscillator();
        const padGain = context.createGain();
        const overtoneGain = context.createGain();
        const pulseGain = context.createGain();

        pad.type = 'sine';
        overtone.type = 'triangle';
        pulse.type = 'sine';
        padGain.gain.value = EPSILON;
        overtoneGain.gain.value = EPSILON;
        pulseGain.gain.value = EPSILON;
        pad.connect(padGain).connect(musicBus);
        overtone.connect(overtoneGain).connect(musicBus);
        pulse.connect(pulseGain).connect(ambienceBus);

        const noise = context.createBufferSource();
        const noiseBuffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
        noiseBuffer.copyToChannel(seededNoise(noiseBuffer.length), 0);
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const windFilter = context.createBiquadFilter();
        const windGain = context.createGain();
        windFilter.type = 'bandpass';
        windFilter.Q.value = 0.72;
        windGain.gain.value = EPSILON;
        noise.connect(windFilter).connect(windGain).connect(ambienceBus);

        const seaFilter = context.createBiquadFilter();
        const seaGain = context.createGain();
        seaFilter.type = 'lowpass';
        seaFilter.Q.value = 0.84;
        seaGain.gain.value = EPSILON;
        noise.connect(seaFilter).connect(seaGain).connect(ambienceBus);

        pad.start();
        overtone.start();
        pulse.start();
        noise.start();

        this.context = context;
        this.nodes = {
          master,
          compressor,
          musicBus,
          ambienceBus,
          sfxBus,
          reverb,
          reverbGain,
          pad,
          overtone,
          pulse,
          padGain,
          overtoneGain,
          pulseGain,
          noise,
          windFilter,
          windGain,
          seaFilter,
          seaGain,
        };
        this.started = true;
        this._applyMix();
        this._applySceneAudio();
        return true;
      } catch {
        this.supported = false;
        this.context = null;
        this.nodes = null;
        return false;
      }
    }

    _createImpulse(context, seconds, decay) {
      const length = Math.max(1, Math.floor(context.sampleRate * seconds));
      const impulse = context.createBuffer(2, length, context.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const output = impulse.getChannelData(channel);
        const noise = seededNoise(length, 0x51a7e + channel * 7919);
        for (let i = 0; i < length; i++) {
          const envelope = Math.pow(1 - i / length, decay);
          output[i] = noise[i] * envelope * 0.42;
        }
      }
      return impulse;
    }

    _applyMix() {
      if (!this.context || !this.nodes) return;
      const master = this.muted ? EPSILON : Math.max(EPSILON, this.settings.master ** 2 * 0.72);
      const duck = this.settings.ducking && this.story.choiceMode ? 0.68 : 1;
      ramp(this.nodes.master.gain, master, this.context, 0.08);
      ramp(this.nodes.musicBus.gain, this.settings.music ** 2 * duck, this.context, 0.12);
      ramp(this.nodes.ambienceBus.gain, this.settings.ambience ** 2 * duck, this.context, 0.12);
      ramp(this.nodes.sfxBus.gain, this.settings.sfx ** 2, this.context, 0.06);
    }

    _profileForScene() {
      const phase = String(this.scene.phase || '').toLowerCase();
      if (phase.includes('storm') || this.scene.location === 'storm') return LOCATION_PROFILES.storm;
      return LOCATION_PROFILES[this.scene.location] || LOCATION_PROFILES.harbor;
    }

    _applySceneAudio() {
      if (!this.context || !this.nodes) return;
      const profile = this._profileForScene();
      const day = clamp(Math.round(Number(this.scene.day) || 0), 0, 6);
      const tension = DAY_TENSION[day];
      const tuning = DAY_TUNING[day];
      const isStorm = profile === LOCATION_PROFILES.storm;
      const storyDuck = this.story.title ? 0.86 : 1;

      ramp(this.nodes.pad.frequency, profile.root * tuning, this.context, 0.7);
      ramp(this.nodes.overtone.frequency, profile.root * profile.interval * tuning, this.context, 0.72);
      ramp(this.nodes.pulse.frequency, profile.pulseRate * (0.88 + tension * 0.12), this.context, 0.5);
      ramp(this.nodes.padGain.gain, profile.pad * storyDuck, this.context, 0.55);
      ramp(this.nodes.overtoneGain.gain, profile.overtone * storyDuck, this.context, 0.55);
      ramp(this.nodes.pulseGain.gain, profile.pulse * tension, this.context, 0.35);
      ramp(this.nodes.windFilter.frequency, profile.windFrequency * (0.92 + day * 0.025), this.context, 0.45);
      ramp(this.nodes.windGain.gain, profile.wind * tension, this.context, 0.5);
      ramp(this.nodes.seaFilter.frequency, profile.seaFrequency, this.context, 0.45);
      ramp(this.nodes.seaGain.gain, profile.sea * (isStorm ? tension : 1), this.context, 0.5);
      ramp(this.nodes.reverbGain.gain, profile.reverb, this.context, 0.6);
    }

    _syncVisualSettings() {
      if (!this.fx) return;
      this.fx.dataset.intensity = this.settings.cinematicIntensity;
      this.fx.dataset.reduceFlashes = this.settings.reduceFlashes ? 'true' : 'false';
    }

    _syncSceneVisuals() {
      if (!this.fx) return;
      const profile = this._profileForScene();
      this.fx.dataset.mood = profile.mood;
      this.fx.dataset.location = slug(this.scene.location);
      this.fx.dataset.phase = slug(this.scene.phase);
      this.fx.dataset.day = String(clamp(Math.round(Number(this.scene.day) || 0), 0, 6));
    }

    _syncStoryVisuals() {
      if (!this.fx) return;
      this.fx.dataset.speaker = slug(this.story.speaker);
      this.fx.dataset.storyMood = this._storyMood(this.story.title);
      this.fx.dataset.choiceMode = this.story.choiceMode ? 'true' : 'false';
      this.fx.dataset.page = String(Math.max(0, Number(this.story.page) || 0));
    }

    _storyMood(title) {
      const text = String(title || '');
      if (/폭풍|대가|침몰/.test(text)) return 'storm';
      if (/새벽|아침/.test(text)) return 'dawn';
      if (/마지막|결말|FIN/i.test(text)) return 'finale';
      if (/기억|잔상|유리/.test(text)) return 'memory';
      if (/항해|바다|신호/.test(text)) return 'voyage';
      return text ? 'story' : 'none';
    }

    _caption(type, override) {
      if (!this.caption || !this.settings.captions) return;
      const text = override || CAPTIONS[type];
      if (!text) return;
      this.caption.textContent = text;
      this.caption.dataset.visible = 'true';
      root.clearTimeout?.(this.captionTimer);
      this.captionTimer = root.setTimeout?.(() => {
        if (!this.caption) return;
        this.caption.dataset.visible = 'false';
      }, 2600);
    }

    _visualCue(type) {
      if (!this.fx || this.settings.cinematicIntensity === 'off') return;
      const flashHeavy = type === 'thunder' || type === 'impact';
      const cue = flashHeavy && this.settings.reduceFlashes ? `${type}-soft` : type;
      this.cueToken += 1;
      this.fx.dataset.cue = cue;
      this.fx.dataset.cueToken = String(this.cueToken);
      root.clearTimeout?.(this.fxTimer);
      this.fxTimer = root.setTimeout?.(() => {
        if (this.fx?.dataset.cueToken === String(this.cueToken)) this.fx.dataset.cue = 'none';
      }, 1100);
    }

    _tone({
      frequency = 220,
      type = 'sine',
      gain = 0.05,
      duration = 0.45,
      delay = 0,
      endFrequency = null,
      destination = null,
    } = {}) {
      if (!this.context || !this.nodes || this.muted) return;
      try {
        const now = this.context.currentTime + Math.max(0, delay);
        const oscillator = this.context.createOscillator();
        const envelope = this.context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
        if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
        envelope.gain.setValueAtTime(EPSILON, now);
        envelope.gain.exponentialRampToValueAtTime(Math.max(EPSILON, gain), now + Math.min(0.045, duration * 0.2));
        envelope.gain.exponentialRampToValueAtTime(EPSILON, now + duration);
        oscillator.connect(envelope).connect(destination || this.nodes.sfxBus);
        oscillator.start(now);
        oscillator.stop(now + duration + 0.03);
      } catch {}
    }

    _noiseBurst({ gain = 0.035, duration = 0.25, frequency = 500, type = 'bandpass' } = {}) {
      if (!this.context || !this.nodes || this.muted) return;
      try {
        const length = Math.max(1, Math.floor(this.context.sampleRate * duration));
        const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        buffer.copyToChannel(seededNoise(length, 0x8f31 + this.cueToken), 0);
        const source = this.context.createBufferSource();
        const filter = this.context.createBiquadFilter();
        const envelope = this.context.createGain();
        filter.type = type;
        filter.frequency.value = frequency;
        filter.Q.value = 0.8;
        const now = this.context.currentTime;
        envelope.gain.setValueAtTime(Math.max(EPSILON, gain), now);
        envelope.gain.exponentialRampToValueAtTime(EPSILON, now + duration);
        source.buffer = buffer;
        source.connect(filter).connect(envelope).connect(this.nodes.sfxBus);
        source.start(now);
        source.stop(now + duration + 0.03);
      } catch {}
    }

    async resume() {
      if (this.muted) return false;
      if (!this._ensureAudio()) return false;
      try {
        if (this.context.state === 'suspended') await this.context.resume();
        this.started = true;
        return this.context.state === 'running';
      } catch {
        return false;
      }
    }

    async suspend() {
      if (!this.context || this.context.state !== 'running') return false;
      try {
        await this.context.suspend();
        return true;
      } catch {
        return false;
      }
    }

    async deactivate() {
      this.started = false;
      return this.suspend();
    }

    setScene(context = {}) {
      this.scene = {
        day: context.day ?? this.scene.day,
        location: context.location ?? context.scene ?? this.scene.location,
        phase: context.phase ?? this.scene.phase,
      };
      this._syncSceneVisuals();
      if (!this.muted) this._ensureAudio();
      this._applySceneAudio();
      return this;
    }

    setStory(context = {}) {
      this.story = {
        speaker: context.speaker ?? this.story.speaker,
        title: context.title ?? this.story.title,
        page: context.page ?? this.story.page,
        choiceMode: context.choiceMode ?? context.choices ?? false,
      };
      this._syncStoryVisuals();
      this._applyMix();
      this._applySceneAudio();
      return this;
    }

    cue(type = 'tone', detail = {}) {
      const cueType = String(type || 'tone').toLowerCase();
      const data = typeof detail === 'number' ? { index: detail } : (detail || {});
      this._caption(cueType, data.caption);
      this._visualCue(cueType);
      if (this.muted || !this._ensureAudio()) return false;
      void this.resume();

      const index = Number(data.index ?? data.tone ?? 0) || 0;
      switch (cueType) {
        case 'step':
        case 'travel':
          this._noiseBurst({ gain: 0.018, duration: 0.11, frequency: 170, type: 'lowpass' });
          this._tone({ frequency: 92, gain: 0.018, duration: 0.16, endFrequency: 72 });
          break;
        case 'choice':
          this._tone({ frequency: 329.63, gain: 0.038, duration: 0.42 });
          this._tone({ frequency: 493.88, gain: 0.022, duration: 0.52, delay: 0.075 });
          break;
        case 'clue':
          this._tone({ frequency: 440, gain: 0.04, duration: 0.62 });
          this._tone({ frequency: 659.25, gain: 0.027, duration: 0.78, delay: 0.09 });
          break;
        case 'solve':
          [0, 4, 7, 12].forEach((semi, i) => {
            this._tone({
              frequency: 261.63 * 2 ** (semi / 12),
              gain: 0.034,
              duration: 0.68,
              delay: i * 0.105,
            });
          });
          break;
        case 'wrong':
          this._tone({ frequency: 174.61, type: 'sawtooth', gain: 0.022, duration: 0.28, endFrequency: 116.54 });
          this._noiseBurst({ gain: 0.018, duration: 0.2, frequency: 360 });
          break;
        case 'signal':
          [0, 7, 3].forEach((semi, i) => {
            this._tone({ frequency: 392 * 2 ** (semi / 12), gain: 0.028, duration: 0.36, delay: i * 0.19 });
          });
          break;
        case 'bell':
          this._tone({ frequency: 174.61, gain: 0.052, duration: 1.6 });
          this._tone({ frequency: 436.53, gain: 0.018, duration: 1.25, delay: 0.025 });
          break;
        case 'wave':
          this._noiseBurst({ gain: 0.052, duration: 0.75, frequency: 210, type: 'lowpass' });
          break;
        case 'impact':
          this._noiseBurst({ gain: 0.07, duration: 0.52, frequency: 130, type: 'lowpass' });
          this._tone({ frequency: 74, gain: 0.055, duration: 0.48, endFrequency: 41 });
          break;
        case 'thunder':
          this._noiseBurst({ gain: 0.09, duration: 1.15, frequency: 160, type: 'lowpass' });
          this._tone({ frequency: 58, gain: 0.04, duration: 0.9, endFrequency: 32 });
          break;
        case 'page':
          this._noiseBurst({ gain: 0.011, duration: 0.09, frequency: 1450, type: 'highpass' });
          break;
        case 'tone':
        default:
          this._tone({
            frequency: 220 * 2 ** ((index % 12) / 12),
            gain: 0.032,
            duration: 0.38,
          });
          break;
      }
      return true;
    }

    finale(type = 'dawn') {
      const forms = {
        release: { notes: [7, 5, 3, 0], root: 196, mood: 'release' },
        stars: { notes: [0, 4, 7, 12], root: 220, mood: 'stars' },
        remain: { notes: [0, 3, 0, -2], root: 207.65, mood: 'remain' },
        dawn: { notes: [0, 4, 7, 11, 12], root: 220, mood: 'dawn' },
      };
      const form = forms[type] || forms.dawn;
      if (this.fx) {
        this.fx.dataset.mood = form.mood;
        this.fx.dataset.phase = 'finale';
      }
      this._caption('finale');
      this._visualCue('finale');
      if (this.muted || !this._ensureAudio()) return false;
      void this.resume();
      form.notes.forEach((semi, index) => {
        this._tone({
          frequency: form.root * 2 ** (semi / 12),
          gain: 0.044,
          duration: 1.15,
          delay: index * 0.31,
        });
      });
      return true;
    }

    configure(settings = {}) {
      this.settings.master = normalizeVolume(
        settings.master ?? settings.masterVolume ?? settings.volume,
        this.settings.master,
      );
      this.settings.music = normalizeVolume(
        settings.music ?? settings.musicVolume,
        this.settings.music,
      );
      this.settings.ambience = normalizeVolume(
        settings.ambience ?? settings.ambienceVolume,
        this.settings.ambience,
      );
      this.settings.sfx = normalizeVolume(
        settings.sfx ?? settings.sfxVolume ?? settings.effectsVolume,
        this.settings.sfx,
      );
      if (settings.ducking !== undefined) this.settings.ducking = !!settings.ducking;
      if (settings.cinematicIntensity !== undefined) {
        this.settings.cinematicIntensity = normalizeIntensity(settings.cinematicIntensity);
      }
      if (settings.reduceFlashes !== undefined) this.settings.reduceFlashes = !!settings.reduceFlashes;
      if (settings.captions !== undefined) this.settings.captions = !!settings.captions;
      if (settings.muted !== undefined) {
        this.muted = !!settings.muted;
        this.settings.muted = this.muted;
      }
      this._syncVisualSettings();
      this._applyMix();
      if (!this.settings.captions && this.caption) this.caption.dataset.visible = 'false';
      return this;
    }

    setMuted(muted) {
      this.muted = !!muted;
      this.settings.muted = this.muted;
      this._applyMix();
      if (this.muted) void this.suspend();
      else void this.resume();
      return this;
    }
  }

  let singleton = null;

  const getSingleton = () => {
    if (!singleton) singleton = new SensoryEngine();
    return singleton;
  };

  const api = {
    create(options = {}) {
      if (!singleton || options.fresh === true) singleton = new SensoryEngine(options);
      else singleton.configure(options.settings || options);
      return singleton;
    },
    resume() {
      return getSingleton().resume();
    },
    setScene(context) {
      return getSingleton().setScene(context);
    },
    setStory(context) {
      return getSingleton().setStory(context);
    },
    cue(type, detail) {
      return getSingleton().cue(type, detail);
    },
    finale(type) {
      return getSingleton().finale(type);
    },
    configure(settings) {
      return getSingleton().configure(settings);
    },
    setMuted(muted) {
      return getSingleton().setMuted(muted);
    },
    suspend() {
      return getSingleton().suspend();
    },
    deactivate() {
      return getSingleton().deactivate();
    },
  };

  root.LastLightSensory = Object.freeze(api);
})();
