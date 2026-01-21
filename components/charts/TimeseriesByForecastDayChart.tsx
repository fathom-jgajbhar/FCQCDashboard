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

// High-contrast fallback palette to keep lines visually distinct
const fallbackPalette = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
];

interface TimeseriesByForecastDayChartProps {
  consolidatedData: Array<Record<string, any>>;
  models: Model[];
  modelColors: string[];
  variableLabel: string;
}

export const TimeseriesByForecastDayChart: React.FC<
  TimeseriesByForecastDayChartProps
> = ({ consolidatedData, models, modelColors, variableLabel }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 px-1 sm:px-0">
        {variableLabel}
      </h4>
      <div
        className="sm:h-[300px]"
        style={{
          width: "100%",
          height: "250px",
          minHeight: "250px",
        }}
      >
        <ResponsiveContainer>
          <LineChart data={consolidatedData}>
            <CartesianGrid
              stroke={resolvedTheme === "dark" ? "#444" : "#e0e0e0"}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="timestep"
              label={{
                value: "Timestep",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  resolvedTheme === "dark" ? "#1f1f1f" : "#ffffff",
                border: `1px solid ${resolvedTheme === "dark" ? "#444" : "#e0e0e0"}`,
                borderRadius: "6px",
                color: resolvedTheme === "dark" ? "#e0e0e0" : "#000000",
              }}
              labelFormatter={(value) => `Timestep: ${value}`}
            />
            <Legend />
            {models.map((model, modelIndex) => {
              const color =
                modelColors[modelIndex % modelColors.length] ||
                fallbackPalette[modelIndex % fallbackPalette.length];

              return (
                <Line
                  key={model.id}
                  connectNulls
                  dataKey={model.label}
                  dot={false}
                  name={model.label}
                  stroke={color}
                  strokeWidth={2}
                  type="monotone"
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
