"use client";
import React from "react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Model } from "@/config/interfaces/Model";
import { Variable } from "@/config/interfaces/Variable";

interface RMSEAnalysisChartProps {
  models: Model[];
  modelColors: string[];
  forecastDayLabels: string[];
  processVariableData: (
    variable: Variable,
    forecastDayLabels: string[],
  ) => any[];
}

export const RMSEAnalysisChart: React.FC<RMSEAnalysisChartProps> = ({
  models,
  modelColors,
  forecastDayLabels,
  processVariableData,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="sm:h-[350px]"
      style={{ width: "100%", height: "250px", minHeight: "250px" }}
    >
      <ResponsiveContainer>
        <LineChart>
          <CartesianGrid
            stroke={resolvedTheme === "dark" ? "#444" : "#e0e0e0"}
            strokeDasharray="3 3"
          />
          <XAxis
            allowDuplicatedCategory={false}
            dataKey="forecastDay"
            type="category"
          />
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
          {models.map((model, modelIndex) => {
            const rmseVar = model.variable.find(
              (v) => v.label.toUpperCase() === "RMSE",
            );

            if (!rmseVar) return null;

            const chartData = processVariableData(rmseVar, forecastDayLabels);

            return (
              <Line
                key={model.id}
                data={chartData}
                dataKey="value_0"
                dot={{ r: 3 }}
                name={model.label}
                stroke={modelColors[modelIndex % modelColors.length]}
                strokeWidth={2}
                type="monotone"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
