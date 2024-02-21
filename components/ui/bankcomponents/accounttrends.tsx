import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

export function AccountTrends({ data }) {
  return (
    <div
      className={`flex flex-col p-10 shadow-xl w-full h-[408px] bg-white justify-center sm:col-span-1 lg:col-span-2 `}
    >
      <p className="aiinsightstext pt-4">6-Month Account Trend</p>
      <ResponsiveContainer className={"h-full"}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="url(#colorUv)" />

          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c0e7" stopOpacity={1} />
              <stop offset="95%" stopColor="#a34fde" stopOpacity={1} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
