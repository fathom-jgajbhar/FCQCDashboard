"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Search, BarChart3, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegionData {
  id: number;
  label: string;
  modelCount: number;
  variableCount: number;
}

interface RegionsResponse {
  regions: RegionData[];
  total: number;
  metadata: {
    totalModels: number;
    totalRegions: number;
    availableVariables: string[];
  };
}

export default function RegionsPage() {
  const router = useRouter();
  const [data, setData] = useState<RegionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/regions");

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load regions data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const formatRegionName = (label: string) => {
    return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredRegions =
    data?.regions.filter((region) =>
      formatRegionName(region.label)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ) || [];

  const handleRegionSelect = (regionId: number) => {
    setSelectedRegion(regionId);
    router.push(`/regions/${regionId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 rounded" />
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded" />
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold">Regional Model Statistics</h1>
          <p className="text-default-500">
            Explore model performance data across different regions
          </p>
        </div>

        <Alert color="danger" variant="flat">
          {error || "No regions data available."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Regional Model Statistics</h1>
        <p className="text-default-500">
          Explore model performance data across {data.total} regions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardBody className="flex flex-row items-center space-x-3 p-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-default-600">Total Regions</p>
              <p className="text-2xl font-bold">{data.total}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardBody className="flex flex-row items-center space-x-3 p-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-default-600">Total Models</p>
              <p className="text-2xl font-bold">{data.metadata.totalModels}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardBody className="flex flex-row items-center space-x-3 p-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-default-600">Variables</p>
              <p className="text-2xl font-bold">
                {data.metadata.availableVariables.length}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardBody className="flex flex-row items-center space-x-3 p-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-default-600">Avg Models/Region</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  data.regions.reduce((sum, r) => sum + r.modelCount, 0) /
                    data.total,
                )}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Regions Table */}
      <Card>
        <CardHeader className="flex flex-col space-y-4 pb-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">All Regions</h2>
            <Chip color="secondary" variant="flat">
              {filteredRegions.length} regions
            </Chip>
          </div>
          <Input
            className="max-w-md"
            placeholder="Search regions..."
            startContent={<Search className="w-4 h-4 text-default-400" />}
            value={searchQuery}
            variant="bordered"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardHeader>
        <CardBody>
          <Table
            aria-label="Regions table"
            classNames={{
              wrapper: "min-h-[400px]",
            }}
            selectionMode="single"
            onRowAction={(key) => handleRegionSelect(Number(key))}
          >
            <TableHeader>
              <TableColumn key="name" className="w-2/5">
                REGION NAME
              </TableColumn>
              <TableColumn key="id" className="w-1/5">
                ID
              </TableColumn>
              <TableColumn key="models" className="w-1/5">
                MODELS
              </TableColumn>
              <TableColumn key="variables" className="w-1/5">
                VARIABLES
              </TableColumn>
            </TableHeader>
            <TableBody>
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <TableRow
                    key={region.id}
                    className="cursor-pointer hover:bg-default-50"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-semibold">
                          {formatRegionName(region.label)}
                        </p>
                        <p className="text-sm text-default-500">
                          {region.label}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color="default" size="sm" variant="flat">
                        {region.id}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-default-400" />
                        <span className="font-medium">{region.modelCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-default-400" />
                        <span className="font-medium">
                          {region.variableCount}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center" colSpan={4}>
                    <div className="py-8">
                      <p className="text-default-500">
                        No regions found matching your search.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Available Variables */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Available Variables</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {data.metadata.availableVariables.map((variable) => (
              <Chip key={variable} color="primary" size="sm" variant="flat">
                {variable}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
