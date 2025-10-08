import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function PieChartComponent({ breakdownData, CustomTooltip }: any) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={breakdownData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {breakdownData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
