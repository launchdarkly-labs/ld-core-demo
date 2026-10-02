import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLORS,
  DEPLOY_COLOR_STYLES,
} from "@/utils/canadaRollout";
import { useOctogonColors } from "@/components/ui/bankcomponents/useOctogonColors";
import {
  CANADA_MAP_VIEWBOX,
  CANADA_OCTOGON_POSITIONS,
  CANADA_OUTLINE_PATH,
} from "@/utils/canadaOctogonPositions";

type PlacedOctogon = {
  number: number;
  x: number;
  y: number;
};

const shuffledPlacements = (): PlacedOctogon[] => {
  const numbers = Array.from({ length: CANADA_OCTOGON_POSITIONS.length }, (_, index) => index + 1);
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[swapIndex]] = [numbers[swapIndex], numbers[index]];
  }

  return CANADA_OCTOGON_POSITIONS.map(([x, y], index) => ({
    number: numbers[index],
    x,
    y,
  }));
};

export default function CanadaRolloutMap() {
  const { colors, isLoading } = useOctogonColors();
  const [placements, setPlacements] = useState<PlacedOctogon[]>([]);

  useEffect(() => {
    setPlacements(shuffledPlacements());
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative mb-8 w-full overflow-hidden rounded-[2rem] border border-blue-200/70 bg-white/80 px-6 pb-5 pt-6 shadow-[0_28px_80px_-34px_rgba(20,54,140,0.6)] backdrop-blur-md sm:px-8"
      aria-label={`Canada deployment map with ${CANADA_OCTOGON_COUNT} rollout octogons`}
    >
      <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="relative mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-sohnelight text-xs uppercase tracking-[0.28em] text-blue-700">
            Live national rollout
          </p>
          <h2 className="font-audimat text-3xl text-slate-900 sm:text-4xl">
            Canada deployment map
          </h2>
        </div>
        <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-sohnelight text-xs uppercase tracking-wider text-blue-800">
          {CANADA_OCTOGON_COUNT} regions
        </span>
      </div>

      <div
        className="relative w-full"
        style={{ aspectRatio: `${CANADA_MAP_VIEWBOX.width} / ${CANADA_MAP_VIEWBOX.height}` }}
        role="img"
        aria-label={`Canada rollout status across ${CANADA_OCTOGON_COUNT} octogons${isLoading ? ", loading" : ""}`}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${CANADA_MAP_VIEWBOX.width} ${CANADA_MAP_VIEWBOX.height}`}
          aria-hidden="true"
        >
          <path
            d={CANADA_OUTLINE_PATH}
            className="fill-blue-50/60 stroke-blue-300"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
        {placements.map(({ number, x, y }, index) => {
          const color = colors[number - 1] ?? "grey";
          return (
            <div
              key={number}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: isLoading ? 0.45 : 1, scale: 1 }}
                transition={{ delay: (index % 24) * 0.012, duration: 0.22 }}
                title={`Octogon ${number}: ${color}`}
                className={`h-2.5 w-2.5 shadow-sm transition-colors duration-500 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 ${DEPLOY_COLOR_STYLES[color]} ${
                  isLoading ? "animate-pulse" : ""
                }`}
                style={{
                  clipPath:
                    "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/80 pt-4">
        {DEPLOY_COLORS.map((color) => (
          <div key={color} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-sm ${DEPLOY_COLOR_STYLES[color]}`} />
            <span className="font-sohnelight text-xs uppercase tracking-wider text-slate-500">
              {color}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
