"use client";

import { Shield, ChevronRight } from "lucide-react";

interface SecuritySectionProps {
  t: (key: string) => string;
}

export function SecuritySection({ t }: SecuritySectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-cyan-500" />
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.security")}</h2>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-4 opacity-40 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-medium text-zinc-900 dark:text-white">{t("profile.changePassword")}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        <div className="w-full flex items-center justify-between p-4 opacity-40 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-medium text-zinc-900 dark:text-white">{t("profile.twoFactor")}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </section>
  );
}
