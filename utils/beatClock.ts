export const BEAT_BPM = 116;
export const BEAT_LOOP_BARS = 8;
export const BEATS_PER_BAR = 4;

export type BeatClock = {
  startedAt: number | null;
  bpm: number;
  loopBars: number;
  beatsPerBar: number;
  playbackEnabled: boolean;
};

export type MusicalPosition = {
  seconds: number;
  bar: number;
  beat: number;
};

export const loopSeconds = (clock: Pick<BeatClock, "bpm" | "loopBars" | "beatsPerBar">) =>
  (clock.loopBars * clock.beatsPerBar * 60) / clock.bpm;

export const musicalPosition = (clock: BeatClock, now = Date.now()): MusicalPosition => {
  const startedAt = clock.startedAt ?? now;
  const elapsed = Math.max(0, (now - startedAt) / 1000);
  const loop = loopSeconds(clock);
  const local = elapsed % loop;
  const beatIndex = Math.floor(local / (60 / clock.bpm));
  return {
    seconds: local,
    bar: Math.floor(beatIndex / clock.beatsPerBar) + 1,
    beat: (beatIndex % clock.beatsPerBar) + 1,
  };
};
