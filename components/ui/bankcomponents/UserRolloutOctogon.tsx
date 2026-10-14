import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLOR_STYLES,
  type DeployColor,
} from "@/utils/canadaRollout";
import { useOctogonColors } from "@/components/ui/bankcomponents/useOctogonColors";

const OCTOGON_CLIP =
  "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

export default function UserRolloutOctogon() {
  const [regionNumber] = useState(
    () => Math.floor(Math.random() * CANADA_OCTOGON_COUNT) + 1
  );
  const { colors, isLoading, playbackEnabled, flagUpdateId } = useOctogonColors();
  const color = colors[regionNumber - 1] ?? "grey";
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playRef = useRef<((nextColor: DeployColor) => Promise<void>) | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const playIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    import("@/components/ui/bankcomponents/zarathustraFanfare").then((mod) => {
      if (cancelled) return;
      playRef.current = mod.playZarathustra;
      stopRef.current = mod.stopZarathustra;
      setPlayerReady(true);
    });
    return () => {
      cancelled = true;
      stopRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (playbackEnabled) return;
    stopRef.current?.();
    setPlaying(false);
  }, [playbackEnabled]);

  useEffect(() => {
    const play = playRef.current;
    if (!play || !playerReady || !playbackEnabled || flagUpdateId === 0) return;
    const playId = playIdRef.current + 1;
    playIdRef.current = playId;
    setPlaying(true);
    play(color)
      .catch(() => undefined)
      .finally(() => {
        if (playIdRef.current === playId) setPlaying(false);
      });
  }, [flagUpdateId, playerReady, playbackEnabled, color]);

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 mt-6 flex items-center gap-4 rounded-2xl border border-blue-200/80 bg-white/90 px-5 py-4 shadow-xl xl:mx-0"
      aria-label={`Your rollout region ${regionNumber}`}
    >
      <motion.div
        title={`Rollout region ${regionNumber}`}
        animate={{ scale: playing ? 1.06 : 1 }}
        transition={{ duration: 0.2 }}
        className={`grid h-20 w-20 shrink-0 place-items-center shadow-lg transition-colors duration-500 sm:h-24 sm:w-24 ${DEPLOY_COLOR_STYLES[color]} ${
          isLoading ? "animate-pulse" : ""
        }`}
        style={{ clipPath: OCTOGON_CLIP }}
      >
        <span className="font-audimat text-lg text-slate-900 sm:text-xl">{regionNumber}</span>
      </motion.div>
      <p className="font-sohnelight text-[11px] uppercase tracking-[0.22em] text-blue-700">
        Your rollout region
      </p>
    </motion.section>
  );
}
