"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Variable } from "@/config/interfaces/Variable";
import { JSONData } from "@/config/interfaces/JSONData";
import {
  TimeseriesByForecastDayChart,
  RMSEAnalysisChart,
  BiasAnalysisChart,
  ModelComparisonTable,
  ModelPerformanceRadar,
} from "@/components/charts";

const RegionTestPage: React.FC = () => {
  const { selected } = useParams<{ selected: string }>();
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<JSONData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForecastDay, setSelectedForecastDay] = useState<string>("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/data`);

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load region data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (selected) {
      fetchData();
    }
  }, [selected]);

  const processVariableData = (
    variable: Variable,
    forecastDayLabels: string[],
  ) => {
    return variable.value.map((dayData, dayIndex) => ({
      forecastDay: forecastDayLabels[dayIndex] || `Day ${dayIndex}`,
      ...dayData.reduce(
        (acc, value, valueIndex) => {
          acc[`value_${valueIndex}`] = value;

          return acc;
        },
        {} as Record<string, number>,
      ),
    }));
  };

  const processTimeseriesData = (
    variable: Variable,
    forecastDayIndex: number,
    dateLabels: string[],
  ) => {
    const dayData = variable.value[forecastDayIndex];

    if (!dayData) return [];

    return dayData.map((value, timestepIndex) => ({
      date: dateLabels[timestepIndex] || `T${timestepIndex}`,
      value: value,
      timestep: timestepIndex,
    }));
  };

  const processFullTimeseriesData = (
    variable: Variable,
    dateLabels: string[],
  ) => {
    const allData: Array<{
      date: string;
      value: number;
      forecastDay: string;
      timestep: number;
    }> = [];

    variable.value.forEach((dayData, forecastDayIndex) => {
      dayData.forEach((value, timestepIndex) => {
        allData.push({
          date: dateLabels[timestepIndex] || `T${timestepIndex}`,
          value: value,
          forecastDay: `FD${forecastDayIndex}`,
          timestep: timestepIndex,
        });
      });
    });

    return allData;
  };

  const calculateMetricSummary = (values: number[][]) => {
    const flatValues = values.flat().filter((v) => v !== null && !isNaN(v));

    if (flatValues.length === 0) {
      return { min: 0, max: 0, avg: 0, trend: "stable" as const };
    }

    const min = Math.min(...flatValues);
    const max = Math.max(...flatValues);
    const avg = flatValues.reduce((a, b) => a + b, 0) / flatValues.length;

    const quarter = Math.floor(flatValues.length / 4) || 1;
    const firstQuarter = flatValues.slice(0, quarter);
    const lastQuarter = flatValues.slice(-quarter);

    const firstAvg =
      firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
    const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;

    const trend =
      lastAvg > firstAvg * 1.05
        ? ("up" as const)
        : lastAvg < firstAvg * 0.95
          ? ("down" as const)
          : ("stable" as const);

    return { min, max, avg, trend };
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatRegionName = (label: string) => {
    return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-8 w-48 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-3 sm:p-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <Button
            isIconOnly
            as={Link}
            className="hover:bg-default-100"
            href="/"
            variant="light"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Region Details</h1>
        </div>
        <Alert className="mt-4" color="danger" variant="flat">
          {error || "No data available for this region."}
        </Alert>
      </div>
    );
  }

  const region =
    data.region.find((r) => r.id.toString() === selected) || data.region[0];

  if (!region) {
    return (
      <div className="container mx-auto p-3 sm:p-6">
        <Alert color="danger" variant="flat">
          Region not found.
        </Alert>
      </div>
    );
  }

  const forecastDayLabels = data.metadata.dimensions.forecast_day.label;
  const modelColors =
    resolvedTheme === "light"
      ? ["#6663f1", "#3fbf8a", "#f2b94b", "#f07b7b", "#4fb9e8", "#9bcf63"]
      : ["#a5b4fc", "#7bdcb5", "#f6d28f", "#fca5a5", "#8dd1e1", "#c3e88d"];

  const getDateLabels = (forecastDayIndex: number): string[] => {
    // API uses forecast_day starting at 1; UI uses zero-based index
    const targetForecastDay = forecastDayIndex + 1;
    const dateInfo =
      data.date.find((d) => d.forecast_day === targetForecastDay) ||
      data.date[forecastDayIndex];

    return dateInfo?.label || [];
  };

  return (
    <div className="flex w-full h-full flex-col px-3 sm:px-6">
      <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Button
          isIconOnly
          as={Link}
          className="hover:bg-default-100 flex-shrink-0 mt-1"
          href="/"
          variant="light"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            {formatRegionName(region.label)}
          </h1>
          <p className="text-xs sm:text-sm text-default-500 mt-1 break-words">
            Region ID: {region.id} • {region.model.length} Models
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {region.model.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-start sm:items-center pb-2 sm:pb-3 gap-2">
              <h3 className="text-base sm:text-lg font-semibold">
                {model.label}
              </h3>
              <Chip
                className="flex-shrink-0"
                color="secondary"
                size="sm"
                variant="flat"
              >
                {model.variable.length} metrics
              </Chip>
            </CardHeader>
            <CardBody className="pt-2 sm:pt-0 px-3 sm:px-6 py-3 sm:py-4">
              <div className="space-y-2">
                {model.variable.slice(0, 3).map((variable) => {
                  const summary = calculateMetricSummary(variable.value);

                  return (
                    <div
                      key={variable.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center space-x-1">
                        {getTrendIcon(summary.trend)}
                        <span>{variable.label}</span>
                      </span>
                      <span className="font-mono text-xs text-default-600">
                        {summary.avg.toFixed(3)}
                      </span>
                    </div>
                  );
                })}
                {model.variable.length > 3 && (
                  <p className="text-xs text-default-500">
                    +{model.variable.length - 3} more metrics
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Tabs className="w-full" defaultSelectedKey="timeseries">
        <Tab key="by-forecast-day" title="By Forecast Day">
          <div className="mt-3 sm:mt-6 space-y-4 sm:space-y-6">
            {forecastDayLabels.map((fdLabel, fdIndex) => (
              <Card key={fdIndex} className="p-2 sm:p-0">
                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3 flex-col items-start gap-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {fdLabel} - Timeseries Comparison
                  </h3>
                  <p className="text-xs sm:text-sm text-default-500">
                    84 timesteps for forecast day {fdIndex}
                  </p>
                </CardHeader>
                <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {region.model[0]?.variable.map((variable) => {
                      // Consolidate all model data into a single dataset
                      const specificDateLabels = getDateLabels(fdIndex);
                      const consolidatedData: Array<Record<string, any>> = [];

                      // Get the first model's timesteps to establish the base structure
                      const firstModelVar = region.model[0].variable.find(
                        (v) => v.label === variable.label,
                      );

                      if (firstModelVar) {
                        const dayData = firstModelVar.value[fdIndex];

                        if (dayData) {
                          dayData.forEach((_, timestepIndex) => {
                            const dataPoint: Record<string, any> = {
                              timestep: timestepIndex,
                              date:
                                specificDateLabels[timestepIndex] ||
                                `T${timestepIndex}`,
                            };

                            // Add each model's value for this timestep
                            region.model.forEach((model) => {
                              const modelVar = model.variable.find(
                                (v) => v.label === variable.label,
                              );

                              if (
                                modelVar &&
                                modelVar.value[fdIndex]?.[timestepIndex] !==
                                  undefined
                              ) {
                                dataPoint[model.label] =
                                  modelVar.value[fdIndex][timestepIndex];
                              }
                            });

                            consolidatedData.push(dataPoint);
                          });
                        }
                      }

                      return (
                        <TimeseriesByForecastDayChart
                          key={variable.label}
                          consolidatedData={consolidatedData}
                          modelColors={modelColors}
                          models={region.model}
                          variableLabel={variable.label}
                        />
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab key="summary-stats" title="Summary Statistics">
          <div className="mt-3 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {region.model.map((model) => (
              <Card key={model.id} className="p-2 sm:p-0">
                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3 flex-col items-start gap-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {model.label} - Aggregated Metrics
                  </h3>
                  <p className="text-xs sm:text-sm text-default-500">
                    Average across all timesteps and forecast days
                  </p>
                </CardHeader>
                <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {model.variable.map((variable) => {
                      const summary = calculateMetricSummary(variable.value);

                      return (
                        <div
                          key={variable.label}
                          className="border border-default-200 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{variable.label}</h4>
                            {getTrendIcon(summary.trend)}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-default-500">Min</p>
                              <p className="font-mono">
                                {summary.min.toFixed(4)}
                              </p>
                            </div>
                            <div>
                              <p className="text-default-500">Avg</p>
                              <p className="font-mono">
                                {summary.avg.toFixed(4)}
                              </p>
                            </div>
                            <div>
                              <p className="text-default-500">Max</p>
                              <p className="font-mono">
                                {summary.max.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab key="rmse" title="RMSE Analysis">
          <Card className="mt-3 sm:mt-6 p-2 sm:p-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                RMSE (Root Mean Square Error) Trends
              </h3>
            </CardHeader>
            <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
              <RMSEAnalysisChart
                forecastDayLabels={forecastDayLabels}
                modelColors={modelColors}
                models={region.model}
                processVariableData={processVariableData}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="bias" title="Bias Analysis">
          <Card className="mt-3 sm:mt-6 p-2 sm:p-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                Bias Analysis by Model
              </h3>
            </CardHeader>
            <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
              <BiasAnalysisChart
                calculateMetricSummary={calculateMetricSummary}
                modelColors={modelColors}
                models={region.model}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="comparison" title="Model Comparison">
          <Card className="mt-3 sm:mt-6 p-2 sm:p-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                Model Performance Comparison
              </h3>
            </CardHeader>
            <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
              <ModelComparisonTable
                calculateMetricSummary={calculateMetricSummary}
                getTrendIcon={getTrendIcon}
                models={region.model}
              />
            </CardBody>
          </Card>

          <Card className="mt-4 sm:mt-6 p-2 sm:p-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                Model Performance Radar
              </h3>
            </CardHeader>
            <CardBody className="p-3 sm:p-6 pt-2 sm:pt-0">
              <ModelPerformanceRadar
                calculateMetricSummary={calculateMetricSummary}
                modelColors={modelColors}
                models={region.model}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default RegionTestPage;
