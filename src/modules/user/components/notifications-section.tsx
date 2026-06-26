"use client";

import { Bell } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { NotificationSetting } from "@/modules/user/utils/helpers";

type NotifKey = "paymentReminders" | "balanceAlerts" | "transactionNotifications" | "monthlySummary";

interface NotificationsState {
  paymentReminders: boolean;
  balanceAlerts: boolean;
  transactionNotifications: boolean;
  monthlySummary: boolean;
}

interface NotificationsSectionProps {
  notifications: NotificationsState;
  toggleNotification: (key: NotifKey) => void;
  settings: NotificationSetting[];
  t: (key: string) => string;
}

export function NotificationsSection({ notifications, toggleNotification, settings, t }: NotificationsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-cyan-500" />
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-gray-300">{t("profile.notifications")}</h2>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
        {settings.map((setting, index) => (
          <div key={setting.key}>
            {index > 0 && <div className="border-t border-zinc-200 dark:border-zinc-800 mx-3" />}
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-white">{setting.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(setting.key)}
                className={cn(
                  "relative w-12 h-7 rounded-full transition-colors",
                  notifications[setting.key] ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
                )}
                aria-label={setting.label}
              >
                <div
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-white transition-transform",
                    notifications[setting.key] ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
