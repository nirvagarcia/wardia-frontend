"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "../components/auth-layout";
import { AuthInput } from "../components/auth-input";
import { Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { authService } from "@/shared/services/auth-service";

function passwordStrength(password: string): number {
  if (!password) return 0;
  let s = 0;
  if (password.length >= 8) s++;
  if (password.length >= 12) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}

const STRENGTH_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
const STRENGTH_LABELS = ["Muy débil", "Débil", "Regular", "Buena", "Excelente"];

export function ResetPasswordView(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!token) setApiError("Enlace inválido. Solicita uno nuevo desde ¿Olvidaste tu contraseña?");
  }, [token]);

  const strength = passwordStrength(password);

  const validate = (): boolean => {
    const e: { password?: string; confirm?: string } = {};
    if (!password) e.password = "La contraseña es requerida";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!confirmPassword) e.confirm = "Confirma tu contraseña";
    else if (password !== confirmPassword) e.confirm = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !validate()) return;

    setIsLoading(true);
    setApiError("");

    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error al restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="¡Contraseña restablecida!" subtitle="Ya puedes iniciar sesión con tu nueva contraseña">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-5 rounded-full">
              <CheckCircle className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Redirigiendo al inicio de sesión...</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Nueva contraseña" subtitle="Elige una contraseña segura para tu cuenta">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {apiError && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
          </div>
        )}

        <div className="space-y-2">
          <AuthInput
            label="Nueva contraseña"
            type="password"
            icon={Lock}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
            error={errors.password}
            autoComplete="new-password"
          />
          {password && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1.5 flex-1 rounded-full transition-all duration-300",
                      i < strength ? STRENGTH_COLORS[strength - 1] : "bg-zinc-200 dark:bg-zinc-700")}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Seguridad:{" "}
                <span className={cn("font-medium",
                  strength <= 1 && "text-red-600",
                  strength === 2 && "text-orange-600",
                  strength === 3 && "text-yellow-600",
                  strength === 4 && "text-lime-600",
                  strength === 5 && "text-green-600")}>
                  {STRENGTH_LABELS[strength - 1] ?? "Muy débil"}
                </span>
              </p>
            </div>
          )}
        </div>

        <AuthInput
          label="Confirmar contraseña"
          type="password"
          icon={Lock}
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" })); }}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isLoading || !token}
          className={cn(
            "w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
            "bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600",
            "hover:from-emerald-700 hover:via-cyan-700 hover:to-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transform hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Restablecer contraseña <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <Link
          href="/login"
          className="block text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          Volver a Iniciar Sesión
        </Link>
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordView;
