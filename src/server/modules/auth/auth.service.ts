import { randomBytes } from "crypto";
import { ApiError } from "@/server/lib/api-error";
import { hashPassword, verifyPassword } from "@/server/lib/password";
import { sendPasswordResetEmail } from "@/server/lib/mailer";
import { authRepository } from "./auth.repository";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  preferences?: { language?: string; currency?: string; notifications?: Record<string, boolean> } | null;
};

function toPublic(user: { id: string; email: string; name: string; phone: string | null; createdAt: Date; preferences: unknown }): PublicUser {
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, createdAt: user.createdAt, preferences: user.preferences as PublicUser["preferences"] };
}

export const authService = {
  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<PublicUser> {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) throw new ApiError("Este correo ya está registrado", 409);

    const { password, ...rest } = data;
    const passwordHash = await hashPassword(password);
    const user = await authRepository.create({ ...rest, passwordHash });
    return toPublic(user);
  },

  async login(email: string, password: string): Promise<PublicUser> {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new ApiError("Correo o contraseña incorrectos", 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new ApiError("Correo o contraseña incorrectos", 401);

    return toPublic(user);
  },

  async getMe(userId: string): Promise<PublicUser> {
    const user = await authRepository.findById(userId);
    if (!user) throw new ApiError("Usuario no encontrado", 404);
    return toPublic(user);
  },

  async forgotPassword(email: string, baseUrl: string): Promise<void> {
    const user = await authRepository.findByEmail(email);
    if (!user) return; // Don't reveal whether email exists

    await authRepository.deleteExpiredResets(user.id);
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await authRepository.createPasswordReset(user.id, token, expiresAt);

    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await authRepository.findPasswordReset(token);
    if (!reset) throw new ApiError("Token inválido o expirado", 400);
    if (reset.used) throw new ApiError("Este enlace ya fue utilizado", 400);
    if (reset.expiresAt < new Date()) throw new ApiError("El enlace ha expirado", 400);

    const passwordHash = await hashPassword(newPassword);
    await authRepository.updatePassword(reset.userId, passwordHash);
    await authRepository.markResetUsed(reset.id);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) throw new ApiError("Usuario no encontrado", 404);

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) throw new ApiError("Contraseña actual incorrecta", 400);

    const passwordHash = await hashPassword(newPassword);
    await authRepository.updatePassword(userId, passwordHash);
  },

  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string | null; email?: string }
  ): Promise<PublicUser> {
    if (data.email) {
      const existing = await authRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) throw new ApiError("Este correo ya está en uso", 409);
    }
    const user = await authRepository.updateProfile(userId, data);
    return toPublic(user);
  },

  async updatePreferences(
    userId: string,
    preferences: { language?: string; currency?: string; notifications?: Record<string, boolean> }
  ): Promise<void> {
    // Merge with existing preferences
    const user = await authRepository.findById(userId);
    if (!user) throw new ApiError("Usuario no encontrado", 404);
    const existing = (user.preferences as Record<string, unknown>) ?? {};
    const merged = { ...existing, ...preferences,
      notifications: { ...(existing["notifications"] as Record<string, boolean> ?? {}), ...(preferences.notifications ?? {}) },
    };
    await authRepository.updatePreferences(userId, merged);
  },
};
