"use client";

import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { authService } from "@/shared/services/auth-service";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "sonner";
import type { IUser } from "@/shared/types/auth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps): React.JSX.Element | null {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ name: user.name, phone: user.phone ?? "", email: user.email });
      setErrors({});
      setApiError("");
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const e: { name?: string; email?: string } = {};
    if (!formData.name.trim()) e.name = "El nombre es requerido";
    else if (formData.name.trim().length < 2) e.name = "Mínimo 2 caracteres";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Correo inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");
    try {
      const updated = await authService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || undefined,
      });
      setUser({ ...updated, preferences: user?.preferences } as IUser);
      toast.success("Perfil actualizado");
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 pb-20 md:pb-0" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <User className="w-5 h-5 text-cyan-500" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Editar perfil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 pb-8">
          {apiError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ep-name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="ep-name"
                value={formData.name}
                onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
                className={cn("pl-9", errors.name && "border-red-500 focus:ring-red-500")}
                placeholder="Tu nombre completo"
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-phone">Teléfono <span className="text-zinc-400 font-normal text-xs">(opcional)</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="ep-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="pl-9"
                placeholder="+51 999 999 999"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-email">
              Correo electrónico
              <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-normal">
                (cambiarlo afecta el inicio de sesión)
              </span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="ep-email"
                type="email"
                value={formData.email}
                onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                className={cn("pl-9", errors.email && "border-red-500 focus:ring-red-500")}
                placeholder="tu@correo.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
