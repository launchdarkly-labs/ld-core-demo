import * as Tone from "tone";
import { LOOP_BEATS, musicalBeats, type DjBeatSnapshot } from "@/utils/djBeat";

const TEMPO_RAMP_SECONDS = 1.2;

let engineReady = false;
let joined = false;
let kick: Tone.MembraneSynth;
let hat: Tone.NoiseSynth;
let bass: Tone.MonoSynth;
let keys: Tone.PolySynth;
let clap: Tone.NoiseSynth;
let registerClick: Tone.MetalSynth;
let registerBell: Tone.FMSynth;
let registerDrawer: Tone.NoiseSynth;
let scratchGain: Tone.Gain;
let scratchFilter: Tone.Filter;
let scratchNoise: Tone.Noise;
let scratchOsc: Tone.Oscillator;

const lastHit = new Map<Tone.ToneAudioNode, number>();

const play = (voice: Tone.ToneAudioNode, time: number, trigger: () => void) => {
  const previous = lastHit.get(voice) ?? -1;
  if (time <= previous) return;
  lastHit.set(voice, time);
  try {
    trigger();
  } catch {
    // A tempo ramp can ask a voice to restart on a sample it already owns.
  }
};

const beatsToPosition = (beats: number) => {
  const wrapped = ((beats % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS;
  const bars = Math.floor(wrapped / 4);
  const beat = Math.floor(wrapped % 4);
  const sixteenth = Math.floor((wrapped % 1) * 4);
  return `${bars}:${beat}:${sixteenth}`;
};

const ensureEngine = () => {
  if (engineReady) return;
  engineReady = true;

  kick = new Tone.MembraneSynth().toDestination();
  kick.volume.value = -8;

  hat = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  }).toDestination();
  hat.volume.value = -16;

  bass = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
  }).toDestination();
  bass.volume.value = -10;

  keys = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.05, release: 0.2 },
  }).toDestination();
  keys.volume.value = -14;

  const clapFilter = new Tone.Filter({ frequency: 1800, type: "bandpass", Q: 0.8 }).toDestination();
  clap = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
  }).connect(clapFilter);
  clap.volume.value = -10;

  registerClick = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  registerClick.volume.value = -16;

  registerBell = new Tone.FMSynth({
    harmonicity: 8,
    modulationIndex: 12,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.28, sustain: 0, release: 0.08 },
    modulation: { type: "square" },
    modulationEnvelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.04 },
  }).toDestination();
  registerBell.volume.value = -12;

  const drawerFilter = new Tone.Filter({ frequency: 900, type: "lowpass" }).toDestination();
  registerDrawer = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.01, decay: 0.22, sustain: 0 },
  }).connect(drawerFilter);
  registerDrawer.volume.value = -18;

  scratchFilter = new Tone.Filter({ frequency: 800, type: "bandpass", Q: 8 }).toDestination();
  scratchGain = new Tone.Gain(0).connect(scratchFilter);
  scratchNoise = new Tone.Noise("pink").connect(scratchGain);
  scratchOsc = new Tone.Oscillator({ type: "sawtooth", frequency: 180 }).connect(scratchGain);
  scratchNoise.volume.value = -4;
  scratchOsc.volume.value = -16;
  scratchNoise.start();
  scratchOsc.start();

  const scratchRiff = (time: number) => {
    const step = Tone.Time("16n").toSeconds();
    scratchGain.gain.cancelScheduledValues(time);
    scratchFilter.frequency.cancelScheduledValues(time);
    scratchOsc.frequency.cancelScheduledValues(time);
    [true, false, true, false].forEach((forward, index) => {
      const start = time + step * index;
      const filterFrom = forward ? 360 : 2400;
      const filterTo = forward ? 2600 : 420;
      const pitchFrom = forward ? 150 : 520;
      const pitchTo = forward ? 540 : 170;
      scratchFilter.frequency.setValueAtTime(filterFrom, start);
      scratchFilter.frequency.exponentialRampToValueAtTime(filterTo, start + step * 0.8);
      scratchOsc.frequency.setValueAtTime(pitchFrom, start);
      scratchOsc.frequency.exponentialRampToValueAtTime(pitchTo, start + step * 0.8);
      scratchGain.gain.setValueAtTime(0.01, start);
      scratchGain.gain.linearRampToValueAtTime(0.8, start + step * 0.15);
      scratchGain.gain.linearRampToValueAtTime(0.01, start + step * 0.9);
    });
    scratchGain.gain.setValueAtTime(0, time + step * 4);
  };

  const transport = Tone.getTransport();
  transport.cancel(0);
  transport.loop = false;

  transport.scheduleRepeat((time) => {
    play(kick, time, () => kick.triggerAttackRelease("C1", "8n", time));
  }, "4n");

  transport.scheduleRepeat((time) => {
    play(hat, time, () => hat.triggerAttackRelease("16n", time));
  }, "8n");

  transport.scheduleRepeat((time) => {
    play(bass, time, () => bass.triggerAttackRelease("A1", "8n", time));
  }, "8n");

  transport.scheduleRepeat((time) => {
    play(keys, time, () => keys.triggerAttackRelease(["A3", "C4", "E4"], "16n", time));
  }, "2n");

  transport.scheduleRepeat((time) => {
    const flam = 0.018;
    play(clap, time, () => clap.triggerAttackRelease("16n", time, 0.7));
    play(clap, time + flam, () => clap.triggerAttackRelease("32n", time + flam, 0.4));
  }, "2n", "4n");

  transport.scheduleRepeat((time) => {
    const step = Tone.Time("16n").toSeconds();
    play(registerClick, time, () => registerClick.triggerAttackRelease("32n", time, 0.45));
    play(registerClick, time + step, () => registerClick.triggerAttackRelease("32n", time + step, 0.3));
    play(registerBell, time + step * 2, () => registerBell.triggerAttackRelease("C6", "16n", time + step * 2, 0.8));
    play(registerBell, time + step * 3, () => registerBell.triggerAttackRelease("E6", "16n", time + step * 3, 0.6));
    play(registerBell, time + step * 4, () => registerBell.triggerAttackRelease("G6", "8n", time + step * 4, 0.75));
    play(registerDrawer, time + step * 3, () => registerDrawer.triggerAttackRelease("8n", time + step * 3, 0.45));
  }, "2m");

  transport.scheduleRepeat((time) => {
    play(scratchGain, time, () => scratchRiff(time));
  }, "2m", "1:3:0");
};

const seekToRoom = (snapshot: DjBeatSnapshot) => {
  const transport = Tone.getTransport();
  transport.bpm.value = snapshot.bpm;
  transport.position = beatsToPosition(musicalBeats(snapshot));
};

export async function joinDjBeat(snapshot: DjBeatSnapshot) {
  await Tone.start();
  ensureEngine();
  const transport = Tone.getTransport();
  if (!joined || transport.state !== "started") {
    seekToRoom(snapshot);
    if (transport.state !== "started") transport.start();
    joined = true;
    return;
  }
  transport.bpm.rampTo(snapshot.bpm, TEMPO_RAMP_SECONDS);
}

export function followDjTempo(bpm: number) {
  if (!joined || Tone.getTransport().state !== "started") return;
  Tone.getTransport().bpm.rampTo(bpm, TEMPO_RAMP_SECONDS);
}

export function leaveDjBeat() {
  if (!joined) return;
  joined = false;
  const now = Tone.now();
  const transport = Tone.getTransport();
  transport.stop();
  transport.position = 0;
  scratchGain.gain.cancelScheduledValues(now);
  scratchGain.gain.setValueAtTime(0, now);
  keys.releaseAll(now);
}
