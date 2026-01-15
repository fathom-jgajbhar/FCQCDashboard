"use server";
import { NextResponse } from "next/server";

import data from "@/public/datasets/model_skill_stats.json";

export async function GET() {
  return NextResponse.json(data);
}
