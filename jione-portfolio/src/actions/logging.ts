"use server";

import { cookies } from "next/headers";
import { memoryDB } from "@/lib/memory-db";

export async function logPageView() {
  try {
    const cookieStore = await cookies();
    const pageViewData = cookieStore.get("_pageViewData")?.value;
    if (!pageViewData) return;

    const data = JSON.parse(pageViewData);
    memoryDB.addLog({
      url: data.url,
      path: data.path,
      referrer: data.referrer,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    });
  } catch (error) {
    console.error("Failed to log page view:", error);
  }
}
