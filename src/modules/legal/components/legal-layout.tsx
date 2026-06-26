"use client";

/**
 * LegalLayout Component
 * Shared layout for legal pages (privacy, terms)
 */

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
  className?: string;
}

export function LegalLayout({ children, title, lastUpdated, className }: LegalLayoutProps): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-cyan-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Link>
          
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t("legal.lastUpdated")} {lastUpdated}
            </p>
          </div>
        </div>

        <div className={cn(
          "bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm",
          "prose prose-zinc dark:prose-invert max-w-none",
          "prose-headings:text-zinc-900 dark:prose-headings:text-white",
          "prose-p:text-zinc-700 dark:prose-p:text-zinc-300",
          "prose-strong:text-zinc-900 dark:prose-strong:text-white",
          "prose-a:text-cyan-600 dark:prose-a:text-cyan-400",
          className
        )}>
          {children}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {t("auth.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}
