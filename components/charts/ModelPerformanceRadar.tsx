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
      metric: variable.label,
    };

    models.forEach((model) => {
      const modelVar = model.variable.find((v) => v.label === variable.label);

      if (modelVar) {
        const summary = calculateMetricSummary(modelVar.value);

        dataPoint[model.label] = summary.avg;
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
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis />
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
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
