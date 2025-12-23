import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function KPICard({ title, value, change, icon, trend = "neutral" }: KPICardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-400",
  };

  return (
    <div className="glassmorphic rounded-xl p-6 hover:border-fizmo-purple-500/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      {change && (
        <p className={`text-sm ${trendColors[trend]} flex items-center`}>
          {trend === "up" && "↗"}
          {trend === "down" && "↘"}
          {change}
        </p>
      )}
    </div>
  );
}
