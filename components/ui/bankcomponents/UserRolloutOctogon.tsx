import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLOR_STYLES,
  type DeployColor,
} from "@/utils/canadaRollout";
import { useOctogonColors } from "@/components/ui/bankcomponents/useOctogonColors";
import { useDjBeat } from "@/components/ui/bankcomponents/useDjBeat";
import type { BeatChoice } from "@/utils/djBeat";
import { followDjTempo, joinDjBeat, leaveDjBeat } from "@/components/ui/bankcomponents/djBeatPlayback";

const DEPLOY_COLOR_BORDERS: Record<DeployColor, string> = {
  grey: "border-slate-300",
  green: "border-emerald-500",
  red: "border-rose-500",
  yellow: "border-amber-300",
  orange: "border-orange-500",
};

const CHOICE_KEY = "dj-beat-choice";
const RESET_KEY = "dj-beat-reset-at";

const readStoredChoice = (): BeatChoice | "" => {
  const stored = window.localStorage.getItem(CHOICE_KEY);
  return stored === "speed" || stored === "safe" ? stored : "";
};

export default function UserRolloutOctogon() {
  const [regionNumber] = useState(
    () => Math.floor(Math.random() * CANADA_OCTOGON_COUNT) + 1
  );
  const { colors, isLoading, playbackEnabled } = useOctogonColors();
  const { snapshot, vote } = useDjBeat();
  const color = colors[regionNumber - 1] ?? "grey";
  const [joined, setJoined] = useState(false);
  const [choice, setChoice] = useState<BeatChoice | "">("");
  const [incidentState, setIncidentState] = useState<"idle" | "sending" | "tracked" | "failed">("idle");
  const appliedBpm = useRef<number | null>(null);
  const seenReset = useRef<number | null>(null);

  useEffect(() => {
    setChoice(readStoredChoice());
  }, []);

  useEffect(() => {
    if (!snapshot) return;
    const storedReset = Number(window.localStorage.getItem(RESET_KEY) ?? "0");
    if (seenReset.current === null) {
      seenReset.current = snapshot.resetAt;
      if (storedReset !== snapshot.resetAt) {
        window.localStorage.setItem(RESET_KEY, String(snapshot.resetAt));
        window.localStorage.removeItem(CHOICE_KEY);
        setChoice("");
      }
      return;
    }
    if (snapshot.resetAt === seenReset.current) return;
    seenReset.current = snapshot.resetAt;
    window.localStorage.setItem(RESET_KEY, String(snapshot.resetAt));
    window.localStorage.removeItem(CHOICE_KEY);
    setChoice("");
  }, [snapshot]);

  useEffect(() => {
    if (color !== "grey") return;
    leaveDjBeat();
    setJoined(false);
  }, [color]);

  useEffect(() => {
    if (!joined || playbackEnabled) return;
    leaveDjBeat();
  }, [joined, playbackEnabled]);

  useEffect(() => {
    if (!joined || !snapshot) return;
    if (appliedBpm.current === snapshot.bpm) return;
    appliedBpm.current = snapshot.bpm;
    followDjTempo(snapshot.bpm);
  }, [joined, snapshot]);

  useEffect(() => () => leaveDjBeat(), []);

  const join = async () => {
    if (!snapshot) return;
    const starting = playbackEnabled ? joinDjBeat(snapshot) : Promise.resolve();
    appliedBpm.current = snapshot.bpm;
    setJoined(true);
    try {
      await starting;
    } catch (error) {
      console.warn("The shared beat could not start.", error);
    }
  };

  const reportIncident = async () => {
    setIncidentState("sending");
    try {
      const response = await fetch("/api/rollout-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionNumber }),
      });
      if (!response.ok) throw new Error("The incident was not tracked");
      setIncidentState("tracked");
    } catch (error) {
      console.warn("The red region incident was not tracked.", error);
      setIncidentState("failed");
    }
  };

  const castVote = async (nextChoice: BeatChoice) => {
    setChoice(nextChoice);
    window.localStorage.setItem(CHOICE_KEY, nextChoice);
    try {
      await vote(nextChoice);
    } catch (error) {
      console.warn("The beat did not accept the vote.", error);
    }
  };

  if (isLoading || color === "grey") return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 mt-6 flex max-w-xl flex-col gap-4 rounded-2xl border border-blue-200/80 bg-white/90 p-4 shadow-xl xl:mx-0"
      aria-label={`Rollout region ${regionNumber}`}
    >
      <img
        src="/banking/desjardins-dj.jpg"
        alt="Desjardins DJ at the console"
        className={`w-full rounded-xl border-8 ${DEPLOY_COLOR_BORDERS[color]}`}
      />
      <div
        title={`Rollout region ${regionNumber}`}
        className={`grid h-16 w-16 place-items-center shadow-lg ${DEPLOY_COLOR_STYLES[color]}`}
        style={{
          clipPath: "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)",
        }}
      >
        <span className="font-audimat text-lg text-slate-900">{regionNumber}</span>
      </div>
      {!joined ? (
        <button
          type="button"
          onClick={() => {
            void join();
          }}
          disabled={!snapshot}
          className={`grid min-h-24 place-items-center px-8 py-5 text-center font-sohne text-lg text-slate-900 shadow-lg disabled:opacity-50 ${DEPLOY_COLOR_STYLES[color]}`}
          style={{
            clipPath:
              "polygon(1.4rem 0, calc(100% - 1.4rem) 0, 100% 1.4rem, 100% calc(100% - 1.4rem), calc(100% - 1.4rem) 100%, 1.4rem 100%, 0 calc(100% - 1.4rem), 0 1.4rem)",
          }}
        >
          Join the Beat
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            aria-pressed={choice === "speed"}
            onClick={() => {
              void castVote("speed");
            }}
            className={`min-h-16 w-full rounded-2xl bg-orange-500 px-4 py-4 font-sohne text-lg text-slate-900 shadow-lg ${
              choice === "speed" ? "ring-4 ring-slate-900" : ""
            }`}
          >
            More Speed / More Money
          </button>
          <button
            type="button"
            aria-pressed={choice === "safe"}
            onClick={() => {
              void castVote("safe");
            }}
            className={`min-h-16 w-full rounded-2xl bg-emerald-500 px-4 py-4 font-sohne text-lg text-slate-900 shadow-lg ${
              choice === "safe" ? "ring-4 ring-slate-900" : ""
            }`}
          >
            Slower Speed / Safer
          </button>
        </div>
      )}
      {color === "red" && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              void reportIncident();
            }}
            disabled={incidentState === "sending"}
            className="min-h-16 w-full rounded-2xl bg-rose-600 px-4 py-4 font-sohne text-lg text-white shadow-lg disabled:opacity-60"
          >
            Error
          </button>
          {incidentState === "tracked" && (
            <p className="text-center font-sohnelight text-sm text-rose-700">
              Tracked error, latency, and database warning
            </p>
          )}
          {incidentState === "failed" && (
            <p className="text-center font-sohnelight text-sm text-rose-700">
              The incident was not tracked
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}
