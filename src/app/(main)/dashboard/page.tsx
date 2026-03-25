/**
 * Dashboard Page - Financial overview route.
 * 
 * NOTE: In Next.js App Router, this file MUST be named "page.tsx" for routing.
 * The actual component logic is in DashboardView for better modularity.
 */

import React from "react";
import { DashboardView } from "@/views/dashboard";

export default function Page(): React.JSX.Element {
  return <DashboardView />;
}
