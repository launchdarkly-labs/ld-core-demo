import type { DeployColor } from "@/utils/canadaRollout";

export type ZarathustraVoice = {
  label: string;
  detail: string;
};

/** Each octogon color is one voice in the Also sprach Zarathustra opening. */
export const ZARATHUSTRA_VOICES: Record<DeployColor, ZarathustraVoice> = {
  grey: { label: "C", detail: "Opening C" },
  green: { label: "G", detail: "Second tone" },
  red: { label: "High C", detail: "Octave C" },
  yellow: { label: "E → E♭", detail: "Major to minor" },
  orange: { label: "Drums", detail: "Timpani" },
};

type Pitched = {
  offset: number;
  pitch: string;
  duration: number;
};

type DrumHit = Pitched & {
  velocity: number;
};

type Chord = {
  offset: number;
  pitches: string[];
  duration: number;
};

export type ZarathustraScore = {
  melody: Pitched[];
  chords: Chord[];
  bass: Pitched[];
  drums: DrumHit[];
  /** Seconds from the downbeat until the last note is released. */
  length: number;
};

const DRUM_START_SECONDS = 6.5;
const DRUM_BEAT_SECONDS = 0.9;
const DRUM_TRIPLET_SECONDS = DRUM_BEAT_SECONDS / 3;

const DRUM_PHRASE: Array<[string, number]> = [
  ["C2", 1],
  ["G2", 0.75],
  ["C2", 0.85],
  ["G2", 1],
  ["C2", 0.75],
  ["G2", 0.85],
  ["C2", 1],
  ["G2", 0.8],
  ["C2", 0.9],
  ["G2", 1],
  ["C2", 0.85],
  ["G2", 0.95],
];

const fanfareDrums = (): DrumHit[] => [
  ...DRUM_PHRASE.map(([pitch, velocity], index) => ({
    offset: DRUM_START_SECONDS + index * DRUM_TRIPLET_SECONDS,
    pitch,
    duration: 0.12,
    velocity,
  })),
  {
    offset: DRUM_START_SECONDS + DRUM_PHRASE.length * DRUM_TRIPLET_SECONDS,
    pitch: "C2",
    duration: 0.3,
    velocity: 1,
  },
];

export const ZARATHUSTRA_SCORE: Record<DeployColor, ZarathustraScore> = {
  grey: {
    melody: [{ offset: 0, pitch: "C4", duration: 1.5 }],
    chords: [],
    bass: [{ offset: 0, pitch: "C2", duration: 9 }],
    drums: [],
    length: 9,
  },
  green: {
    melody: [{ offset: 1.6, pitch: "G4", duration: 1.5 }],
    chords: [],
    bass: [],
    drums: [],
    length: 3.1,
  },
  red: {
    melody: [{ offset: 3.2, pitch: "C5", duration: 2 }],
    chords: [],
    bass: [],
    drums: [],
    length: 5.2,
  },
  yellow: {
    melody: [],
    chords: [
      { offset: 5.3, pitches: ["C4", "G4", "C5", "E5"], duration: 0.6 },
      { offset: 5.9, pitches: ["C4", "G4", "C5", "Eb5"], duration: 2.5 },
    ],
    bass: [],
    drums: [],
    length: 8.4,
  },
  orange: {
    melody: [],
    chords: [],
    bass: [],
    drums: fanfareDrums(),
    length: DRUM_START_SECONDS + DRUM_PHRASE.length * DRUM_TRIPLET_SECONDS + 0.3,
  },
};
