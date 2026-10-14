import * as Tone from "tone";
import type { DeployColor } from "@/utils/canadaRollout";
import { ZARATHUSTRA_SCORE } from "@/utils/zarathustra";

const RELEASE_TAIL_SECONDS = 1.6;

type Voices = {
  brass: Tone.PolySynth;
  bass: Tone.Synth;
  drums: Tone.MembraneSynth;
  dispose: () => void;
};

let generation = 0;
let stopActive: (() => void) | null = null;

if (typeof window !== "undefined") {
  const unlockAudio = () => {
    void Tone.start();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio);
  window.addEventListener("keydown", unlockAudio);
}

const createVoices = (): Voices => {
  const brass = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: {
      attack: 0.08,
      decay: 0.2,
      sustain: 0.7,
      release: 0.8,
    },
  }).toDestination();
  brass.volume.value = -15;

  const bass = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 1.5,
    },
  }).toDestination();
  bass.volume.value = -18;

  const drums = new Tone.MembraneSynth({
    pitchDecay: 0.015,
    octaves: 0.5,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0,
      release: 0.3,
    },
  }).toDestination();
  drums.volume.value = -10;

  return {
    brass,
    bass,
    drums,
    dispose() {
      brass.releaseAll();
      bass.triggerRelease();
      drums.triggerRelease();
      brass.dispose();
      bass.dispose();
      drums.dispose();
    },
  };
};

const schedule = (voices: Voices, color: DeployColor, start: number) => {
  const score = ZARATHUSTRA_SCORE[color];
  for (const note of score.melody) {
    voices.brass.triggerAttackRelease(note.pitch, note.duration, start + note.offset);
  }
  for (const chord of score.chords) {
    voices.brass.triggerAttackRelease(chord.pitches, chord.duration, start + chord.offset);
  }
  for (const note of score.bass) {
    voices.bass.triggerAttackRelease(note.pitch, note.duration, start + note.offset);
  }
  for (const hit of score.drums) {
    voices.drums.triggerAttackRelease(hit.pitch, hit.duration, start + hit.offset, hit.velocity);
  }
};

export function stopZarathustra() {
  stopActive?.();
}

export async function playZarathustra(color: DeployColor): Promise<void> {
  const token = ++generation;
  stopZarathustra();
  await Tone.start();
  if (token !== generation) return;

  const voices = createVoices();
  await new Promise<void>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      voices.dispose();
      if (stopActive === settle) stopActive = null;
      resolve();
    };
    stopActive = settle;
    const start = Tone.now() + 0.1;
    schedule(voices, color, start);
    timer = setTimeout(
      settle,
      (ZARATHUSTRA_SCORE[color].length + RELEASE_TAIL_SECONDS) * 1000
    );
  });
}
