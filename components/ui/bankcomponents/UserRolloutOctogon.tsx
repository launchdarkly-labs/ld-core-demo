import { useState } from "react";
import { motion } from "framer-motion";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLOR_STYLES,
} from "@/utils/canadaRollout";
import { useOctogonColors } from "@/components/ui/bankcomponents/useOctogonColors";

const OCTOGON_CLIP =
  "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

export default function UserRolloutOctogon() {
  const [regionNumber] = useState(
    () => Math.floor(Math.random() * CANADA_OCTOGON_COUNT) + 1
  );
  const { colors, isLoading } = useOctogonColors();
  const color = colors[regionNumber - 1] ?? "grey";

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 mt-6 flex items-center gap-5 rounded-2xl border border-blue-200/80 bg-white/90 px-5 py-4 shadow-xl xl:mx-0"
      aria-label={`Your rollout region ${regionNumber} is ${color}`}
    >
      <div
        title={`Octogon ${regionNumber}: ${color}`}
        className={`grid h-20 w-20 shrink-0 place-items-center shadow-lg transition-colors duration-500 sm:h-24 sm:w-24 ${DEPLOY_COLOR_STYLES[color]} ${
          isLoading ? "animate-pulse" : ""
        }`}
        style={{ clipPath: OCTOGON_CLIP }}
      >
        <span className="font-audimat text-lg text-slate-900 sm:text-xl">{regionNumber}</span>
      </div>
      <div>
        <p className="font-sohnelight text-[11px] uppercase tracking-[0.22em] text-blue-700">
          Your rollout region
        </p>
        <p className="font-sohne text-xl text-slate-900 sm:text-2xl">
          Octogon {regionNumber}
        </p>
        <p className="mt-1 font-sohnelight text-sm capitalize text-slate-500">
          map-octogon {regionNumber} · {color}
        </p>
      </div>
    </motion.section>
  );
}
