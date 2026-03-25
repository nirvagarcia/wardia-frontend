/**
 * Empty Credentials State Component
 * Displays when no credentials exist.
 */

import React from "react";
import { ShieldCheck } from "lucide-react";

interface EmptyCredentialsStateProps {
  t: (key: string) => string;
}

export function EmptyCredentialsState({ t }: EmptyCredentialsStateProps): React.JSX.Element {
  return (
    <div className="card-surface rounded-2xl p-12 text-center">
      <div className="w-16 h-16 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        {t("credentials.noCredentials")}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
        {t("credentials.addFirstCredential")}
      </p>
    </div>
  );
}
