"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  dt: string;
  v: number;
}

interface FlowChartProps {
  data: DataPoint[];
  title: string;
  yAxisLabel: string;
  unit: string;
  color?: string;
}

export default function FlowChart({
  data,
  title,
  yAxisLabel,
  unit,
  color = "#3182CE",
}: FlowChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.dt).getTime(),
    value: d.v,
  }));

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (data.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">{title}</h4>
        <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded border">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold mb-2 text-gray-700">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="time"
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            stroke="#666"
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11 },
            }}
            tick={{ fontSize: 11 }}
            stroke="#666"
          />
          <Tooltip
            labelFormatter={formatTooltipDate}
            formatter={(value: number) => [`${value.toFixed(3)} ${unit}`, yAxisLabel]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${title.replace(/\s/g, "")})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

