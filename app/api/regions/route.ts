import { NextResponse } from "next/server";

import data from "@/public/datasets/model_skill_stats.json";

export async function GET() {
  try {
    // Extract region list with basic info
    const regions = (data as any).region.map((region: any) => ({
      id: region.id,
      label: region.label,
      modelCount: region.model.length,
      variableCount: region.model.reduce(
        (total: number, model: any) => total + model.variable.length,
        0,
      ),
    }));

    return NextResponse.json({
      regions,
      total: regions.length,
      metadata: {
        totalModels: (data as any).metadata.dimensions.model.length,
        totalRegions: (data as any).metadata.dimensions.region.length,
        availableVariables: (data as any).metadata.variables.map(
          (v: any) => v.name,
        ),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch regions data" },
      { status: 500 },
    );
  }
}
