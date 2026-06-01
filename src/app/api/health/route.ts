import { NextResponse } from "next/server";
import { dbHealthCheck } from "@/lib/db";

export async function GET() {
  const data = await dbHealthCheck();
  return NextResponse.json(data);
}
