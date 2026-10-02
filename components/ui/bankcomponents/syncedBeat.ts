import * as Tone from "tone";
import type { BeatClock } from "@/utils/beatClock";
import { musicalPosition } from "@/utils/beatClock";
import type { DeployColor } from "@/utils/canadaRollout";

type Contribution = DeployColor;

export type SyncedBeat = {
  join: () => Promise<void>;
  leave: () => void;
  setContribution: (color: Contribution) => void;
  setPlaybackEnabled: (enabled: boolean) => void;
  dispose: () => void;
};

export async function createSyncedBeat(clock: BeatClock): Promise<SyncedBeat> {
  const transport = Tone.getTransport();
  let contribution: Contribution = "grey";
  let contributionsEnabled = clock.playbackEnabled;
  let joined = false;
  let disposed = false;

  const kick = new Tone.MembraneSynth({
    volume: -8,
    pitchDecay: 0.05,
    octaves: 5,
  }).toDestination();
  const hat = new Tone.MetalSynth({
    volume: -22,
    envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 3500,
    octaves: 1,
  }).toDestination();
  const bass = new Tone.MonoSynth({
    volume: -14,
    oscillator: { type: "square" },
    envelope: { attack: 0.005, decay: 0.18, sustain: 0.15, release: 0.08 },
    filterEnvelope: {
      attack: 0.005,
      decay: 0.12,
      sustain: 0.1,
      release: 0.08,
      baseFrequency: 90,
      octaves: 2.2,
    },
  }).toDestination();
  const clap = new Tone.NoiseSynth({
    volume: -12,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
  }).toDestination();
  const keys = new Tone.PolySynth(Tone.Synth, {
    volume: -16,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.004, decay: 0.16, sustain: 0.02, release: 0.08 },
  }).toDestination();
  const chop = new Tone.Synth({
    volume: -15,
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.003, decay: 0.07, sustain: 0, release: 0.04 },
  }).toDestination();

  const hears = (color: Contribution) => contributionsEnabled && contribution === color;

  transport.bpm.value = clock.bpm;
  transport.loop = true;
  transport.loopStart = 0;
  transport.loopEnd = `${clock.loopBars}:0:0`;

  transport.scheduleRepeat((time) => {
    kick.triggerAttackRelease("C1", "8n", time);
  }, "4n");
  transport.scheduleRepeat((time) => {
    hat.triggerAttackRelease("G5", "32n", time, 0.2);
  }, "8n", "8n");

  const bassNotes = ["A1", "A1", "D2", "E1"];
  const keyChords = [
    ["A3", "C4", "E4", "G4"],
    ["A3", "C4", "E4", "G4"],
    ["D3", "F3", "A3", "C4"],
    ["E3", "G#3", "B3", "D4"],
  ];
  const chops = ["E4", "G4", "A4", "C5"];

  for (let bar = 0; bar < clock.loopBars; bar += 1) {
    const bassNote = bassNotes[bar % bassNotes.length];
    const chord = keyChords[bar % keyChords.length];
    transport.schedule((time) => {
      if (hears("green")) bass.triggerAttackRelease(bassNote, "8n", time);
    }, `${bar}:0:2`);
    transport.schedule((time) => {
      if (hears("green")) bass.triggerAttackRelease(bassNote, "8n", time);
    }, `${bar}:2:2`);
    transport.schedule((time) => {
      if (hears("red")) clap.triggerAttackRelease("16n", time);
    }, `${bar}:1:0`);
    transport.schedule((time) => {
      if (hears("red")) clap.triggerAttackRelease("16n", time);
    }, `${bar}:3:0`);
    transport.schedule((time) => {
      if (hears("yellow")) keys.triggerAttackRelease(chord, "8n", time);
    }, `${bar}:1:0`);
    chops.forEach((note, index) => {
      transport.schedule((time) => {
        if (hears("orange")) chop.triggerAttackRelease(note, "32n", time);
      }, `${bar}:3:${index}`);
    });
  }

  const seekToRoom = () => {
    transport.seconds = musicalPosition(clock).seconds;
  };

  return {
    async join() {
      if (disposed || joined) return;
      await Tone.start();
      seekToRoom();
      if (transport.state !== "started") transport.start();
      joined = true;
    },
    leave() {
      if (disposed || !joined) return;
      transport.stop();
      joined = false;
    },
    setContribution(color) {
      contribution = color;
    },
    setPlaybackEnabled(enabled) {
      contributionsEnabled = enabled;
    },
    dispose() {
      disposed = true;
      transport.stop();
      transport.cancel(0);
      [kick, hat, bass, clap, keys, chop].forEach((voice) => voice.dispose());
    },
  };
}

export const CONTRIBUTION_LABEL: Record<DeployColor, string> = {
  grey: "Backing beat",
  green: "Bass line",
  red: "Handclaps",
  yellow: "Chord stab",
  orange: "Guitar chop",
};
