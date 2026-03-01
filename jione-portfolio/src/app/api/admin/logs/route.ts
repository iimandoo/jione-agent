import { NextResponse } from "next/server";
import { memoryDB } from "@/lib/memory-db";

export async function GET() {
  const logs = memoryDB.getLogs(100);
  const stats = memoryDB.getStats();

  return NextResponse.json({
    logs: logs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    })),
    stats: Object.entries(stats).reduce(
      (acc, [path, data]) => {
        acc[path] = {
          count: data.count,
          lastVisit: data.lastVisit.toISOString(),
        };
        return acc;
      },
      {} as Record<string, { count: number; lastVisit: string }>,
    ),
  });
}
