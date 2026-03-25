/**
 * Accounts Page - Banking products management route.
 * 
 * NOTE: In Next.js App Router, this file MUST be named "page.tsx" for routing.
 * The actual component logic is in AccountsView for better modularity.
 */

import React from "react";
import { AccountsView } from "@/components/views/accounts-view";

export default function Page(): React.JSX.Element {
  return <AccountsView />;
}
