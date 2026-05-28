"use client";

import { useRecordRecentVisit } from "@/lib/hooks/useRecentMenu";

export function RouteTracker() {
  useRecordRecentVisit();
  return null;
}
