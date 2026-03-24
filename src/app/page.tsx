/**
 * Root page - Redirects to dashboard.
 */

import { redirect } from "next/navigation";

export default function Home(): never {
  redirect("/dashboard");
}
