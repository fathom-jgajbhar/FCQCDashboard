import { NextRequest, NextResponse } from "next/server";

import data from "@/public/datasets/model_skill_stats.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { regionId: string } },
) {
  try {
    const regionId = parseInt(params.regionId);

    if (isNaN(regionId)) {
      return NextResponse.json(
        { error: "Invalid region ID. Must be a number." },
        { status: 400 },
      );
    }

    // Find the specific region
    const region = (data as any).region.find((r: any) => r.id === regionId);

    if (!region) {
      return NextResponse.json(
        { error: `Region with ID ${regionId} not found` },
        { status: 404 },
      );
    }

    // Include metadata for context
    const response = {
      metadata: (data as any).metadata,
      region: region,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Optional: Add a GET route to list all regions
export async function OPTIONS() {
  const regions = (data as any).region.map((region: any) => ({
    id: region.id,
    label: region.label,
  }));

  return NextResponse.json({
    regions,
    total: regions.length,
  });
}
