"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

export function BarChart({ data, color = "#a855f7", height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
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
        <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
