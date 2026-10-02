import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLOR_STYLES,
  type DeployColor,
} from "@/utils/canadaRollout";
import { musicalPosition, type BeatClock } from "@/utils/beatClock";
import { useOctogonColors } from "@/components/ui/bankcomponents/useOctogonColors";
import type { SyncedBeat } from "@/components/ui/bankcomponents/syncedBeat";

const OCTOGON_CLIP =
  "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

const PART_LABEL: Record<DeployColor, string> = {
  grey: "Backing beat",
  green: "Bass line",
  red: "Handclaps",
  yellow: "Chord stab",
  orange: "Guitar chop",
};

export default function UserRolloutOctogon() {
  const [regionNumber] = useState(
    () => Math.floor(Math.random() * CANADA_OCTOGON_COUNT) + 1
  );
  const { colors, isLoading, playbackEnabled } = useOctogonColors();
  const color = colors[regionNumber - 1] ?? "grey";
  const [clock, setClock] = useState<BeatClock | null>(null);
  const [position, setPosition] = useState({ bar: 1, beat: 1 });
  const [joined, setJoined] = useState(false);
  const beatRef = useRef<SyncedBeat | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/beat-clock", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: BeatClock) => {
        if (data.playbackEnabled && typeof data.startedAt === "number") {
          setClock((current) => (current?.startedAt === data.startedAt ? current : data));
          return;
        }
        setClock(null);
        setJoined(false);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("The shared beat clock is unavailable.", error);
        }
      });
    return () => controller.abort();
  }, [playbackEnabled]);

  useEffect(() => {
    if (!clock?.startedAt) return;
    const update = () => setPosition(musicalPosition(clock));
    update();
    const timer = setInterval(update, 80);
    return () => clearInterval(timer);
  }, [clock]);

  useEffect(() => {
    if (!clock) return;
    let cancelled = false;
    import("@/components/ui/bankcomponents/syncedBeat").then(({ createSyncedBeat }) => {
      if (cancelled) return;
      return createSyncedBeat(clock).then((beat) => {
        if (cancelled) {
          beat.dispose();
          return;
        }
        beatRef.current = beat;
        beat.setContribution(color);
        beat.setPlaybackEnabled(playbackEnabled);
      });
    });
    return () => {
      cancelled = true;
      beatRef.current?.dispose();
      beatRef.current = null;
      setJoined(false);
    };
    // The engine is created once per room clock. Contribution changes are applied below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock]);

  useEffect(() => {
    beatRef.current?.setContribution(color);
    beatRef.current?.setPlaybackEnabled(playbackEnabled);
  }, [color, playbackEnabled]);

  const toggleBeat = async () => {
    if (joined) {
      beatRef.current?.leave();
      setJoined(false);
      return;
    }

    await beatRef.current?.join();
    if (beatRef.current) setJoined(true);
  };

  const beatIsLive = Boolean(clock?.startedAt);
  const partLabel = beatIsLive ? PART_LABEL[color] : "Beat is off";

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 mt-6 flex flex-col gap-4 rounded-2xl border border-blue-200/80 bg-white/90 px-5 py-4 shadow-xl sm:flex-row sm:items-center xl:mx-0"
      aria-label={`Your rollout region ${regionNumber} is ${color}, playing ${partLabel}`}
    >
      <motion.div
        title={`Octogon ${regionNumber}: ${color}`}
        animate={{ scale: position.beat === 1 ? 1.06 : 1 }}
        transition={{ duration: 0.08 }}
        className={`grid h-20 w-20 shrink-0 place-items-center shadow-lg transition-colors duration-500 sm:h-24 sm:w-24 ${DEPLOY_COLOR_STYLES[color]} ${
          isLoading ? "animate-pulse" : ""
        }`}
        style={{ clipPath: OCTOGON_CLIP }}
      >
        <span className="font-audimat text-lg text-slate-900 sm:text-xl">{regionNumber}</span>
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="font-sohnelight text-[11px] uppercase tracking-[0.22em] text-blue-700">
          Your rollout region
        </p>
        <p className="font-sohne text-xl text-slate-900 sm:text-2xl">
          Octogon {regionNumber}
        </p>
        <p className="mt-1 font-sohnelight text-sm text-slate-500">
          {beatIsLive ? `Bar ${position.bar} · Beat ${position.beat} · ${partLabel}` : partLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={toggleBeat}
        disabled={!beatIsLive}
        className={`rounded-full px-4 py-2 font-sohnelight text-sm text-white disabled:bg-slate-300 ${
          joined ? "bg-slate-700 hover:bg-slate-800" : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        {joined ? "Exit the beat" : beatIsLive ? "Join the beat" : "Beat is off"}
      </button>
    </motion.section>
  );
}
