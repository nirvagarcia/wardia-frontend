import { Suspense } from "react";
import ResetPasswordPage from "@/modules/auth/reset-password/ResetPasswordPage";

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}

