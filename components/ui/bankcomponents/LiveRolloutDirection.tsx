import { useDjBeat } from "@/components/ui/bankcomponents/useDjBeat";

const BARS = [
  {
    key: "speed",
    label: "More Speed / More Money",
    bar: "bg-orange-500",
    percent: (speedPercent: number) => speedPercent,
  },
  {
    key: "safe",
    label: "Slower Speed / Safer",
    bar: "bg-emerald-500",
    percent: (_speedPercent: number, safePercent: number) => safePercent,
  },
] as const;

export default function LiveRolloutDirection() {
  const { snapshot, resetVotes } = useDjBeat();
  const speedPercent = snapshot?.speedPercent ?? 50;
  const safePercent = snapshot?.safePercent ?? 50;

  return (
    <section
      className="mt-6 rounded-[2rem] border border-blue-200/70 bg-white/90 px-5 py-6 shadow-[0_28px_80px_-34px_rgba(20,54,140,0.6)] sm:px-8"
      aria-label="Live rollout direction"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sohnelight text-xs uppercase tracking-[0.28em] text-blue-700">
            Shared beat
          </p>
          <h2 className="font-audimat text-3xl text-slate-900 sm:text-4xl">Live Rollout Direction</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            void resetVotes();
          }}
          className="min-h-12 rounded-full bg-slate-900 px-5 py-3 font-sohnelight text-sm text-white hover:bg-slate-700"
        >
          Reset Votes
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {BARS.map((item) => {
          const percent = item.percent(speedPercent, safePercent);
          return (
            <div key={item.key}>
              <div className="mb-2 flex items-end justify-between gap-3">
                <p className="font-sohne text-base text-slate-900 sm:text-lg">{item.label}</p>
                <p className="shrink-0 font-audimat text-2xl text-slate-900">{percent}%</p>
              </div>
              <div className="h-8 overflow-hidden rounded-full bg-slate-200 sm:h-10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 font-sohnelight text-sm text-slate-500">
        Starts at 50 / 50. Each vote moves one point toward that choice and one point the other way.
      </p>
    </section>
  );
}
