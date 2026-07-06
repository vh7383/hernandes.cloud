import { NextResponse } from "next/server";
import { getAllServiceStatuses, getMonitoringStatus } from "@/lib/status";

export async function GET() {
  const [services, monitoringStatus] = await Promise.all([
    getAllServiceStatuses(),
    getMonitoringStatus(),
  ]);

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    services,
    monitoring: { status: monitoringStatus },
  });
}
