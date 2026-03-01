import { NextResponse } from "next/server";
import { memoryDB } from "@/lib/memory-db";

export async function POST() {
  memoryDB.clearLogs();
  return NextResponse.json({ success: true });
}
