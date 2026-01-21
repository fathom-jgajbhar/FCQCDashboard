"use client";
import React from "react";

import { Model } from "@/config/interfaces/Model";

interface ModelComparisonTableProps {
  models: Model[];
  calculateMetricSummary: (values: number[][]) => {
    min: number;
    max: number;
    avg: number;
    trend: "up" | "down" | "stable";
  };
  getTrendIcon: (trend: "up" | "down" | "stable") => React.ReactNode;
}

export const ModelComparisonTable: React.FC<ModelComparisonTableProps> = ({
  models,
  calculateMetricSummary,
  getTrendIcon,
}) => {
  return (
    <div className="overflow-x-auto -mx-1 sm:mx-0">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-default-200">
            <th className="text-left p-2 sm:p-3 font-semibold whitespace-nowrap">
              Model
            </th>
            {models[0]?.variable.map((variable) => (
              <th
                key={variable.label}
                className="text-left p-2 sm:p-3 font-semibold whitespace-nowrap"
              >
                {variable.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((model, index) => (
            <tr
              key={model.id}
              className={`hover:bg-default-50 ${
                index !== models.length - 1 ? "border-b border-default-100" : ""
              }`}
            >
              <td className="p-2 sm:p-3 font-medium whitespace-nowrap">
                {model.label}
              </td>
              {model.variable.map((variable) => {
                const summary = calculateMetricSummary(variable.value);

                return (
                  <td
                    key={variable.label}
                    className="p-2 sm:p-3 whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="font-mono text-sm">
                        {summary.avg.toFixed(4)}
                      </span>
                      {getTrendIcon(summary.trend)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
