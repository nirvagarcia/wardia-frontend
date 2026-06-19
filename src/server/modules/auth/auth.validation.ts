import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email("Correo electrónico inválido").optional(),
});

export const updatePreferencesSchema = z.object({
  language: z.string().optional(),
  currency: z.string().optional(),
  notifications: z.record(z.string(), z.boolean()).optional(),
});
