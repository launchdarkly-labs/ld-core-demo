export const VOTING_POPULATION = 100;
export const LOOP_BEATS = 32;
export const NEUTRAL_BPM = 100;
export const BPM_PER_PERCENT = 10;
export const MIN_BPM = 30;

export type BeatChoice = "speed" | "safe";

export type DjBeatSnapshot = {
  speedVotes: number;
  safeVotes: number;
  speedPercent: number;
  safePercent: number;
  population: number;
  bpm: number;
  anchorWallMs: number;
  anchorBeat: number;
  loopBeats: number;
  resetAt: number;
  revision: number;
};

export const isBeatChoice = (value: unknown): value is BeatChoice =>
  value === "speed" || value === "safe";

export const bpmForShare = (speedPercent: number) =>
  Math.max(MIN_BPM, NEUTRAL_BPM + (speedPercent - 50) * BPM_PER_PERCENT);

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export const tallyVotes = (votes: Record<string, BeatChoice>, resetAt: number) => {
  const speedVotes = Object.values(votes).filter((choice) => choice === "speed").length;
  const safeVotes = Object.values(votes).filter((choice) => choice === "safe").length;
  const speedPercent = clampPercent(50 + speedVotes - safeVotes);
  const safePercent = clampPercent(50 + safeVotes - speedVotes);
  return {
    speedVotes,
    safeVotes,
    speedPercent,
    safePercent,
    population: VOTING_POPULATION,
    bpm: bpmForShare(speedPercent),
    resetAt,
  };
};

export const musicalBeats = (snapshot: Pick<DjBeatSnapshot, "anchorWallMs" | "anchorBeat" | "bpm" | "loopBeats">, now = Date.now()) => {
  const elapsedSeconds = Math.max(0, (now - snapshot.anchorWallMs) / 1000);
  const beats = snapshot.anchorBeat + elapsedSeconds * (snapshot.bpm / 60);
  const loop = snapshot.loopBeats;
  return ((beats % loop) + loop) % loop;
};

type Room = {
  votes: Record<string, BeatChoice>;
  voteTimes: Record<string, number>;
  anchorWallMs: number;
  anchorBeat: number;
  bpm: number;
  resetAt: number;
  revision: number;
};

const room = globalThis as typeof globalThis & { __djBeatRoom?: Room };

const createRoom = (): Room => ({
  votes: {},
  voteTimes: {},
  anchorWallMs: Date.now(),
  anchorBeat: 0,
  bpm: bpmForShare(50),
  resetAt: 0,
  revision: 0,
});

const getRoom = () => {
  if (!room.__djBeatRoom) room.__djBeatRoom = createRoom();
  if (typeof room.__djBeatRoom.revision !== "number" || Number.isNaN(room.__djBeatRoom.revision)) {
    room.__djBeatRoom.revision = 0;
  }
  if (!room.__djBeatRoom.voteTimes) room.__djBeatRoom.voteTimes = {};
  return room.__djBeatRoom;
};

const advanceAnchor = (state: Room, now: number, nextBpm: number) => {
  state.anchorBeat = musicalBeats({ ...state, loopBeats: LOOP_BEATS }, now);
  state.anchorWallMs = now;
  state.bpm = nextBpm;
};

export const beatSnapshot = (): DjBeatSnapshot => {
  const state = getRoom();
  const tally = tallyVotes(state.votes, state.resetAt);
  return {
    ...tally,
    bpm: state.bpm,
    anchorWallMs: state.anchorWallMs,
    anchorBeat: state.anchorBeat,
    loopBeats: LOOP_BEATS,
    revision: state.revision,
  };
};

export const castBeatVote = (voterId: string, choice: BeatChoice, resetAt?: number, castAt = Date.now()) => {
  const state = getRoom();
  if (resetAt !== undefined && resetAt !== state.resetAt) return beatSnapshot();
  const previousAt = state.voteTimes[voterId] ?? 0;
  if (castAt < previousAt) return beatSnapshot();
  if (state.votes[voterId] === choice) {
    state.voteTimes[voterId] = castAt;
    return beatSnapshot();
  }
  state.votes[voterId] = choice;
  state.voteTimes[voterId] = castAt;
  state.revision += 1;
  const tally = tallyVotes(state.votes, state.resetAt);
  advanceAnchor(state, Date.now(), tally.bpm);
  return beatSnapshot();
};

export const resetBeatVotes = () => {
  const state = getRoom();
  state.votes = {};
  state.voteTimes = {};
  state.resetAt = Date.now();
  state.revision += 1;
  advanceAnchor(state, state.resetAt, bpmForShare(50));
  return beatSnapshot();
};
