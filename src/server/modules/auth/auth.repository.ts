import { prisma } from "@/server/db/client";
import { Prisma } from "@prisma/client";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  passwordHash: string;
  preferences: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const authRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<UserRow | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: { name: string; email: string; phone?: string; passwordHash: string }): Promise<UserRow> {
    return prisma.user.create({ data });
  },

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string | null; email?: string }): Promise<UserRow> {
    return prisma.user.update({ where: { id: userId }, data });
  },

  async updatePreferences(userId: string, preferences: unknown): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { preferences: preferences as Prisma.InputJsonValue } });
  },

  async createPasswordReset(userId: string, token: string, expiresAt: Date) {
    return prisma.passwordReset.create({ data: { userId, token, expiresAt } });
  },

  async findPasswordReset(token: string) {
    return prisma.passwordReset.findUnique({ where: { token } });
  },

  async markResetUsed(id: string) {
    await prisma.passwordReset.update({ where: { id }, data: { used: true } });
  },

  async deleteExpiredResets(userId: string) {
    await prisma.passwordReset.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } },
    });
  },
};
