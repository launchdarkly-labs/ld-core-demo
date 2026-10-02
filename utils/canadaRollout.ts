export const CANADA_OCTOGON_COUNT = 1000;

export const DEPLOY_COLORS = ["grey", "green", "red", "yellow", "orange"] as const;

export type DeployColor = (typeof DEPLOY_COLORS)[number];

export const DEPLOY_COLOR_STYLES: Record<DeployColor, string> = {
  grey: "bg-slate-300 shadow-slate-400/40",
  green: "bg-emerald-500 shadow-emerald-500/40",
  red: "bg-rose-500 shadow-rose-500/40",
  yellow: "bg-amber-300 shadow-amber-400/40",
  orange: "bg-orange-500 shadow-orange-500/40",
};
