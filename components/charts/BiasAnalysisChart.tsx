"use client";
import React from "react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Model } from "@/config/interfaces/Model";

interface BiasAnalysisChartProps {
  models: Model[];
  modelColors: string[];
  calculateMetricSummary: (values: number[][]) => {
    min: number;
    max: number;
    avg: number;
    trend: "up" | "down" | "stable";
  };
}

export const BiasAnalysisChart: React.FC<BiasAnalysisChartProps> = ({
  models,
  modelColors,
  calculateMetricSummary,
}) => {
  const { resolvedTheme } = useTheme();

  const chartData = models.map((model) => {
    const biasVar = model.variable.find(
      (v) => v.label.toUpperCase() === "BIAS",
    );
    const summary = biasVar
      ? calculateMetricSummary(biasVar.value)
      : { avg: 0, min: 0, max: 0 };

    return {
      model: model.label,
      avgBias: summary.avg,
      minBias: summary.min,
      maxBias: summary.max,
    };
  });

  return (
    <div
      className="sm:h-[350px]"
      style={{ width: "100%", height: "250px", minHeight: "250px" }}
    >
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid
            stroke={resolvedTheme === "dark" ? "#444" : "#e0e0e0"}
            strokeDasharray="3 3"
          />
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: resolvedTheme === "dark" ? "#1f1f1f" : "#ffffff",
              border: `1px solid ${resolvedTheme === "dark" ? "#444" : "#e0e0e0"}`,
              borderRadius: "6px",
              color: resolvedTheme === "dark" ? "#e0e0e0" : "#000000",
            }}
          />
          <Legend />
          <Bar dataKey="avgBias" fill={modelColors[0]} name="Average Bias" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
