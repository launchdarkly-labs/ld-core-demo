export const CANADA_OCTOGON_COUNT = 500;

export const DEPLOY_COLORS = ["grey", "green", "red", "yellow", "orange"] as const;

export type DeployColor = (typeof DEPLOY_COLORS)[number];
