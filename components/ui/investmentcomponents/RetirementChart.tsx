import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const dummyData = [
  { name: "A", value: 40, color: "#dc2626" },
  { name: "B", value: 85, color: "#16a34a" },
  { name: "C", value: 25, color: "#2563eb" },
];

// const cx = "100%";
// const cy = "100%";
const iR = "60%";
const oR = "80%";

const RetirementChart = () => {
  const renderedData = dummyData;

  return (
    // <ResponsiveContainer>
    //   <PieChart>
    //     <Pie
    //       dataKey="value"
    //       startAngle={180}
    //       endAngle={0}
    //       data={renderedData}
    //       cx={cx}
    //       cy={cy}
    //       innerRadius={iR}
    //       outerRadius={oR}
    //       stroke="none"
    //     >

    //     </Pie>
    //   </PieChart>
    // </ResponsiveContainer>

    <ResponsiveContainer width="100%" className="min-h-0 shrink" aspect={1.2}>
      <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} >
        <Pie
          data={renderedData}
          startAngle={180}
          endAngle={0}
          // cx={cx}
          // cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          dataKey="value"
          // blendStroke
          // stroke={{opacity: 1}}
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
