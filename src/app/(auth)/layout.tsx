/**
 * Layout for authentication routes (login, register, etc.).
 * Minimal layout without bottom navigation.
 * The actual styling is handled by the AuthLayout component in views.
 */

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Readonly<AuthLayoutProps>): React.JSX.Element {
  return <>{children}</>;
}
