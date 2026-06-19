import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env["WARDIA_ENCRYPTION_KEY"];
  if (!raw) throw new Error("WARDIA_ENCRYPTION_KEY is not set");
  const buf = Buffer.from(raw, "hex");
  if (buf.length !== 32) throw new Error("WARDIA_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  return buf;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(":");
  if (parts.length !== 3) throw new Error("Invalid ciphertext format");
  const [ivHex, authTagHex, encHex] = parts;
  const iv = Buffer.from(ivHex!, "hex");
  const authTag = Buffer.from(authTagHex!, "hex");
  const encrypted = Buffer.from(encHex!, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export function encryptOptional(value: string | undefined | null): string | null {
  if (!value) return null;
  return encrypt(value);
}

export function decryptOptional(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  return decrypt(value);
}
