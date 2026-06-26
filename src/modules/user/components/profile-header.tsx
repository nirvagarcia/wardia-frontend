"use client";

import { Mail, Phone } from "lucide-react";
import { ProfileAvatar } from "./profile-avatar";
import type { IUser } from "@/shared/types/auth";
import type { Language } from "@/shared/stores/preferences-store";

interface ProfileHeaderProps {
  user: IUser | null;
  language: Language;
  onEdit: () => void;
  t: (key: string) => string;
}

export function ProfileHeader({ user, language, onEdit, t }: ProfileHeaderProps) {
  const locale = language === "es" ? "es-PE" : "en-US";
  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(user.createdAt))
    : "";

  return (
    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center mb-6">
        <ProfileAvatar name={user?.name ?? ""} />
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name ?? ""}</h2>
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
              title={t("profile.editProfile")}
              aria-label={t("profile.editProfile")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("profile.memberSince")} {memberSince}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("profile.email")}</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user?.email ?? ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-500/10 p-2 rounded-lg">
            <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("profile.phone")}</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.phone ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
