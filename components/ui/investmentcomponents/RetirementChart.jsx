import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const dummyData = [
  { name: "A", value: 40, color: "#dc2626" },
  { name: "B", value: 85, color: "#16a34a" },
  { name: "C", value: 25, color: "#2563eb" },
];

const cx = "50%";
const cy = "50%";
const iR = 50;
const oR = 100;

const RetirementChart = () => {
  const renderedData = dummyData;

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={renderedData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          stroke="none"
        >
          {renderedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RetirementChart;
