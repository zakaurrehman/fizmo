"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

export function LineChart({ data, color = "#a855f7", height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
        <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
