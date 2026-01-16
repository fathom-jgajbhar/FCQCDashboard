"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import Link from "next/link";

export default function TestRegionsPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [regionId, setRegionId] = useState("1");

  const testRegionsListAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/regions");
      const data = await response.json();

      setApiResponse(data);
    } catch {
      setApiResponse({ error: "Failed to fetch regions" });
    } finally {
      setLoading(false);
    }
  };

  const testRegionDetailAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/regions/${regionId}`);
      const data = await response.json();

      setApiResponse(data);
    } catch {
      setApiResponse({ error: "Failed to fetch region details" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Test Regional Data APIs</h1>
        <p className="text-default-500">
          Test the API endpoints and explore the regional data functionality
        </p>
      </div>

      {/* API Testing Controls */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">API Testing</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <Button
              color="primary"
              isLoading={loading}
              onClick={testRegionsListAPI}
            >
              Test Regions List API
            </Button>

            <div className="flex gap-2 items-end">
              <Input
                className="w-32"
                label="Region ID"
                size="sm"
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
              />
              <Button
                color="secondary"
                isLoading={loading}
                onClick={testRegionDetailAPI}
              >
                Test Region Detail API
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* API Response Display */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">API Response</h3>
          </CardHeader>
          <CardBody>
            <pre className="bg-default-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Links</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button as={Link} color="primary" href="/regions" variant="flat">
              View All Regions
            </Button>
            <Button
              as={Link}
              color="secondary"
              href="/regions/1"
              variant="flat"
            >
              View Region 1 Details
            </Button>
            <Button as={Link} color="success" href="/regions/2" variant="flat">
              View Region 2 Details
            </Button>
            <Button as={Link} color="warning" href="/regions/5" variant="flat">
              View Region 5 Details
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Sample Data Info */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Sample Data Information</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-default-600">
            The regional data contains model skill statistics with the following
            structure:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Available Regions:</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <Chip key={id} size="sm" variant="flat">
                    Region {id}
                  </Chip>
                ))}
                <Chip color="secondary" size="sm" variant="flat">
                  ...and more
                </Chip>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Available Metrics:</h4>
              <div className="flex flex-wrap gap-2">
                <Chip color="primary" size="sm" variant="flat">
                  RMSE
                </Chip>
                <Chip color="primary" size="sm" variant="flat">
                  Bias
                </Chip>
                <Chip color="primary" size="sm" variant="flat">
                  Correlation
                </Chip>
              </div>
            </div>
          </div>

          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-default-600">
              <li>Interactive charts using Recharts</li>
              <li>Model performance comparison tables</li>
              <li>Statistical summaries and trend analysis</li>
              <li>Responsive design with HeroUI components</li>
              <li>Search and filtering capabilities</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
