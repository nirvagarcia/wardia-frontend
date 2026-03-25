/**
 * Services Page - Subscriptions and recurring payments management route.
 * 
 * NOTE: In Next.js App Router, this file MUST be named "page.tsx" for routing.
 * The actual component logic is in ServicesView for better modularity.
 */

import React from "react";
import { ServicesView } from "@/views/services";

export default function Page(): React.JSX.Element {
  return <ServicesView />;
}
