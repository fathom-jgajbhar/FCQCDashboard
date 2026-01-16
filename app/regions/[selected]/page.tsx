"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

interface Variable {
  label: string;
  value: (number | null)[][];
}

interface Model {
  id: number;
  label: string;
  variable: Variable[];
}

interface RegionData {
  id: number;
  label: string;
  model: Model[];
}

interface Metadata {
  dimensions: {
    region: { description: string; length: number; labels: string[] };
    model: { description: string; length: number; labels: string[] };
    forecast_day: { description: string; length: number; label: string[] };
    date: { description: string; format: string; length: number };
  };
  variables: Array<{
    name: string;
    dimensions: string[];
    shape: number[];
    description: string;
  }>;
}

interface ApiResponse {
  metadata: Metadata;
  region: RegionData;
}

export default function RegionPage() {
  const params = useParams();
  const regionId = params.selected as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/regions/${regionId}`);

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

    if (regionId) {
      fetchRegionData();
    }
  }, [regionId]);

  const processVariableData = (variable: Variable) => {
    const forecastDays = data?.metadata.dimensions.forecast_day.label || [];

    return variable.value.map((dayData, dayIndex) => ({
      forecastDay: forecastDays[dayIndex] || `Day ${dayIndex}`,
      ...dayData.reduce(
        (acc, value, valueIndex) => {
          acc[`value_${valueIndex}`] = value;

          return acc;
        },
        {} as Record<string, number | null>,
      ),
    }));
  };

  const calculateMetricSummary = (values: (number | null)[][]) => {
    const flatValues = values.flat().filter((v): v is number => v !== null);

    if (flatValues.length === 0)
      return { min: 0, max: 0, avg: 0, trend: "stable" };

    const min = Math.min(...flatValues);
    const max = Math.max(...flatValues);
    const avg = flatValues.reduce((a, b) => a + b, 0) / flatValues.length;

    // Simple trend calculation (comparing first and last quarters)
    const quarter = Math.floor(flatValues.length / 4);
    const firstQuarter = flatValues.slice(0, quarter);
    const lastQuarter = flatValues.slice(-quarter);

    const firstAvg =
      firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
    const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;

    const trend =
      lastAvg > firstAvg * 1.05
        ? "up"
        : lastAvg < firstAvg * 0.95
          ? "down"
          : "stable";

    return { min, max, avg, trend };
  };

  const getTrendIcon = (trend: string) => {
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
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-8 w-48 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button
            isIconOnly
            as={Link}
            className="hover:bg-default-100"
            href="/regions"
            variant="light"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">Region Details</h1>
        </div>

        <Alert className="mt-4" color="danger" variant="flat">
          {error || "No data available for this region."}
        </Alert>
      </div>
    );
  }

  const { region } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Button
          isIconOnly
          as={Link}
          className="hover:bg-default-100"
          href="/regions"
          variant="light"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {formatRegionName(region.label)}
          </h1>
          <p className="text-default-500">
            Region ID: {region.id} • {region.model.length} Models
          </p>
        </div>
      </div>

      {/* Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {region.model.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-semibold">{model.label}</h3>
              <Chip color="secondary" size="sm" variant="flat">
                {model.variable.length} metrics
              </Chip>
            </CardHeader>
            <CardBody className="pt-0">
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

      {/* Detailed Analysis */}
      <Tabs className="w-full" defaultSelectedKey="overview">
        <Tab key="overview" title="Overview">
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {region.model.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <h3 className="text-xl font-semibold">
                    {model.label} Model Metrics
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
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
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                RMSE (Root Mean Square Error) Trends
              </h3>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="forecastDay" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {region.model.map((model, modelIndex) => {
                      const rmseVar = model.variable.find(
                        (v) => v.label === "RMSE",
                      );

                      if (!rmseVar) return null;

                      const chartData = processVariableData(rmseVar);
                      const colors = [
                        "#8884d8",
                        "#82ca9d",
                        "#ffc658",
                        "#ff7c7c",
                        "#8dd1e1",
                      ];

                      return (
                        <Line
                          key={model.id}
                          connectNulls={false}
                          data={chartData}
                          dataKey="value_0"
                          name={model.label}
                          stroke={colors[modelIndex % colors.length]}
                          type="monotone"
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="bias" title="Bias Analysis">
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Bias Analysis</h3>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={region.model.map((model) => {
                      const biasVar = model.variable.find(
                        (v) => v.label === "Bias" || v.label === "BIAS",
                      );
                      const summary = biasVar
                        ? calculateMetricSummary(biasVar.value)
                        : { avg: 0 };

                      return {
                        model: model.label,
                        avgBias: summary.avg,
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgBias" fill="#8884d8" name="Average Bias" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="comparison" title="Model Comparison">
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Model Performance Comparison
              </h3>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-default-200">
                      <th className="text-left p-3 font-semibold">Model</th>
                      {region.model[0]?.variable.map((variable) => (
                        <th
                          key={variable.label}
                          className="text-left p-3 font-semibold"
                        >
                          {variable.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {region.model.map((model, index) => (
                      <tr
                        key={model.id}
                        className={`hover:bg-default-50 ${
                          index !== region.model.length - 1
                            ? "border-b border-default-100"
                            : ""
                        }`}
                      >
                        <td className="p-3 font-medium">{model.label}</td>
                        {model.variable.map((variable) => {
                          const summary = calculateMetricSummary(
                            variable.value,
                          );

                          return (
                            <td key={variable.label} className="p-3">
                              <div className="flex items-center space-x-2">
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
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
