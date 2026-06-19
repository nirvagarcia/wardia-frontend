import { prisma } from "@/server/db/client";
import { encrypt, decryptOptional } from "@/server/lib/crypto";
import type { ICredential } from "@/shared/types/finance";
import type { CredentialCreateInput, CredentialUpdateInput } from "./credentials.validation";

type CredentialRow = Awaited<ReturnType<typeof prisma.credential.findFirst>> & {};

function maskLast4(value: string | null): string | undefined {
  if (!value) return undefined;
  const plain = value.length >= 4 ? value : value;
  return `****${plain.slice(-4)}`;
}

/** Full decrypted record — for edit/reveal (GET by-ID). */
function toCredentialFull(row: NonNullable<CredentialRow>): ICredential {
  return {
    id: row.id,
    type: row.type as ICredential["type"],
    bankName: row.bankName,
    credentialName: row.credentialName ?? undefined,
    description: row.description ?? undefined,
    username: row.username ?? undefined,
    password: decryptOptional(row.passwordEnc),
    cardName: row.cardName ?? undefined,
    cardNetwork: row.cardNetwork as ICredential["cardNetwork"],
    accountNumber: decryptOptional(row.accountNumberEnc),
    cci: decryptOptional(row.cciEnc),
    expiryMonth: row.expiryMonth ?? undefined,
    expiryYear: row.expiryYear ?? undefined,
    cvv: decryptOptional(row.cvvEnc),
    accountType: row.accountType as ICredential["accountType"],
    cardholderName: row.cardholderName ?? undefined,
    creditLimitValue: row.creditLimitValue ?? undefined,
    creditLimitCurrency: row.creditLimitCurrency ?? undefined,
    cutoffDay: row.cutoffDay ?? undefined,
    lastUpdated: row.updatedAt,
  };
}

/** Masked record — for list view. Sensitive fields replaced with placeholders. */
function toCredentialSafe(row: NonNullable<CredentialRow>): ICredential {
  const accountNumberPlain = decryptOptional(row.accountNumberEnc);
  const cciPlain = decryptOptional(row.cciEnc);
  return {
    ...toCredentialFull(row),
    password: row.passwordEnc ? "***" : undefined,
    cvv: row.cvvEnc ? "***" : undefined,
    accountNumber: accountNumberPlain ? maskLast4(accountNumberPlain) : undefined,
    cci: cciPlain ? maskLast4(cciPlain) : undefined,
  };
}

export async function findAllByUser(userId: string): Promise<ICredential[]> {
  const rows = await prisma.credential.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toCredentialSafe);
}

export async function findById(id: string, userId: string): Promise<ICredential | null> {
  const row = await prisma.credential.findFirst({ where: { id, userId } });
  return row ? toCredentialFull(row) : null;
}

export async function create(userId: string, data: CredentialCreateInput): Promise<ICredential> {
  const row = await prisma.credential.create({
    data: {
      userId,
      type: data.type,
      bankName: data.bankName,
      credentialName: data.credentialName ?? null,
      description: data.description ?? null,
      username: data.username ?? null,
      passwordEnc: data.password ? encrypt(data.password) : null,
      cardName: data.cardName ?? null,
      cardNetwork: data.cardNetwork ?? null,
      accountNumberEnc: data.accountNumber ? encrypt(data.accountNumber) : null,
      cciEnc: data.cci ? encrypt(data.cci) : null,
      expiryMonth: data.expiryMonth ?? null,
      expiryYear: data.expiryYear ?? null,
      cvvEnc: data.cvv ? encrypt(data.cvv) : null,
      accountType: data.accountType ?? null,
      cardholderName: data.cardholderName ?? null,
      creditLimitValue: data.creditLimitValue ?? null,
      creditLimitCurrency: data.creditLimitCurrency ?? null,
      cutoffDay: data.cutoffDay ?? null,
    },
  });
  return toCredentialFull(row);
}

export async function update(id: string, data: CredentialUpdateInput): Promise<ICredential> {
  const patch: Record<string, unknown> = {};
  if (data.type !== undefined) patch["type"] = data.type;
  if (data.bankName !== undefined) patch["bankName"] = data.bankName;
  if (data.credentialName !== undefined) patch["credentialName"] = data.credentialName ?? null;
  if (data.description !== undefined) patch["description"] = data.description ?? null;
  if (data.username !== undefined) patch["username"] = data.username ?? null;
  if (data.password !== undefined) patch["passwordEnc"] = data.password ? encrypt(data.password) : null;
  if (data.cardName !== undefined) patch["cardName"] = data.cardName ?? null;
  if (data.cardNetwork !== undefined) patch["cardNetwork"] = data.cardNetwork ?? null;
  if (data.accountNumber !== undefined) patch["accountNumberEnc"] = data.accountNumber ? encrypt(data.accountNumber) : null;
  if (data.cci !== undefined) patch["cciEnc"] = data.cci ? encrypt(data.cci) : null;
  if (data.expiryMonth !== undefined) patch["expiryMonth"] = data.expiryMonth ?? null;
  if (data.expiryYear !== undefined) patch["expiryYear"] = data.expiryYear ?? null;
  if (data.cvv !== undefined) patch["cvvEnc"] = data.cvv ? encrypt(data.cvv) : null;
  if (data.accountType !== undefined) patch["accountType"] = data.accountType ?? null;
  if (data.cardholderName !== undefined) patch["cardholderName"] = data.cardholderName ?? null;
  if (data.creditLimitValue !== undefined) patch["creditLimitValue"] = data.creditLimitValue ?? null;
  if (data.creditLimitCurrency !== undefined) patch["creditLimitCurrency"] = data.creditLimitCurrency ?? null;
  if (data.cutoffDay !== undefined) patch["cutoffDay"] = data.cutoffDay ?? null;

  const row = await prisma.credential.update({ where: { id }, data: patch });
  return toCredentialFull(row);
}

export async function remove(id: string): Promise<void> {
  await prisma.credential.delete({ where: { id } });
}

