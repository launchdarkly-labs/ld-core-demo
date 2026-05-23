/** Demo channel art — styled labels only, not official network assets. */
export const CHANNELS = {
  "hits-1": {
    label: "HITS 1",
    sublabel: "Hits 1",
    bg: "#1a0a2e",
    brand: "#a855f7",
    pattern:
      "radial-gradient(circle at 70% 30%, #c084fc 0%, transparent 50%), linear-gradient(145deg, #4c1d95 0%, #1e1b4b 100%)",
  },
  "alt-nation": {
    label: "ALT NATION",
    sublabel: "Alt Nation",
    bg: "#0f172a",
    brand: "#f97316",
    pattern:
      "radial-gradient(circle at 30% 70%, #fb923c 0%, transparent 45%), linear-gradient(145deg, #1c1917 0%, #0f172a 100%)",
  },
  "the-highway": {
    label: "The Highway",
    sublabel: "The Highway",
    bg: "#451a03",
    brand: "#fbbf24",
    pattern:
      "linear-gradient(160deg, #92400e 0%, #78350f 40%, #451a03 100%)",
  },
  "hip-hop-nation": {
    label: "HIP HOP NATION",
    sublabel: "Hip-Hop Nation",
    bg: "#000",
    brand: "#ef4444",
    pattern:
      "radial-gradient(circle at 50% 40%, #dc2626 0%, transparent 55%), linear-gradient(180deg, #171717 0%, #000 100%)",
  },
  "fm-radio": {
    label: "FM Radio",
    sublabel: "SiriusXM FM",
    bg: "#1e3a5f",
    brand: "#38bdf8",
    pattern: "linear-gradient(145deg, #0c4a6e 0%, #1e3a8a 100%)",
  },
  espn: {
    label: "ESPN",
    sublabel: "ESPN Radio",
    bg: "#7f1d1d",
    brand: "#fff",
    pattern: "linear-gradient(145deg, #dc2626 0%, #991b1b 50%, #450a0a 100%)",
  },
  "mad-dog": {
    label: "MAD DOG",
    sublabel: "Mad Dog Sports Radio",
    bg: "#0f172a",
    brand: "#facc15",
    pattern: "linear-gradient(145deg, #1e40af 0%, #0f172a 100%)",
  },
  "pga-tour": {
    label: "PGA TOUR",
    sublabel: "PGA TOUR Radio",
    bg: "#14532d",
    brand: "#fff",
    pattern: "linear-gradient(145deg, #166534 0%, #052e16 100%)",
  },
  nfl: {
    label: "NFL",
    sublabel: "NFL",
    bg: "#013369",
    brand: "#fff",
    pattern: "linear-gradient(145deg, #1d4ed8 0%, #013369 100%)",
  },
};

export default function ChannelTile({ id }) {
  const ch = CHANNELS[id];
  if (!ch) return null;

  return (
    <div
      className="channel-tile"
      style={{
        background: ch.pattern,
        "--tile-brand": ch.brand,
      }}
      title={ch.sublabel}
    >
      <span className="channel-tile-brand">{ch.label}</span>
    </div>
  );
}
