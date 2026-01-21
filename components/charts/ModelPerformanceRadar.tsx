"use client";
import React from "react";
import { useTheme } from "next-themes";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Model } from "@/config/interfaces/Model";

interface ModelPerformanceRadarProps {
  models: Model[];
  modelColors: string[];
  calculateMetricSummary: (values: number[][]) => {
    min: number;
    max: number;
    avg: number;
    trend: "up" | "down" | "stable";
  };
}

export const ModelPerformanceRadar: React.FC<ModelPerformanceRadarProps> = ({
  models,
  modelColors,
  calculateMetricSummary,
}) => {
  const { resolvedTheme } = useTheme();

  const radarData = models[0]?.variable.map((variable) => {
    const dataPoint: any = {
      metric: variable.label.substring(0, 15), // Truncate long names for readability
    };

    models.forEach((model) => {
      const modelVar = model.variable.find((v) => v.label === variable.label);

      if (modelVar) {
        const summary = calculateMetricSummary(modelVar.value);

        // Normalize values to 0-100 scale for better radar visualization
        dataPoint[model.label] = Math.min(100, Math.max(0, summary.avg * 10));
      }
    });

    return dataPoint;
  });

  return (
    <div
      className="sm:h-[450px]"
      style={{ width: "100%", height: "300px", minHeight: "300px" }}
    >
      <ResponsiveContainer>
        <RadarChart data={radarData}>
          <PolarGrid stroke={resolvedTheme === "dark" ? "#444" : "#e0e0e0"} />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: resolvedTheme === "dark" ? "#1f1f1f" : "#ffffff",
              border: `1px solid ${resolvedTheme === "dark" ? "#444" : "#e0e0e0"}`,
              borderRadius: "6px",
              color: resolvedTheme === "dark" ? "#e0e0e0" : "#000000",
            }}
          />
          <Legend />
          {models.map((model, index) => (
            <Radar
              key={model.id}
              dataKey={model.label}
              fill={modelColors[index % modelColors.length]}
              fillOpacity={0.3}
              name={model.label}
              stroke={modelColors[index % modelColors.length]}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
