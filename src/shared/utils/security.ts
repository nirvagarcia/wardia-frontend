/**
 * Masks sensitive financial data for display purposes.
 * Ensures that account numbers, credit card numbers, and other sensitive information
 * are not fully exposed in the UI.
 */

/**
 * Masks a credit card number, showing only the last 4 digits.
 * @param cardNumber - The full credit card number
 * @returns Masked card number (e.g., "**** **** **** 1234")
 */
export function maskCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length < 4) {
    return "****";
  }
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}

/**
 * Masks a bank account number or CCI, showing only the last 4 digits.
 * @param accountNumber - The full account number
 * @returns Masked account number
 */
export function maskAccountNumber(accountNumber: string): string {
  const cleaned = accountNumber.replace(/\s|-/g, "");
  if (cleaned.length < 4) {
    return "****";
  }
  const lastFour = cleaned.slice(-4);
  const maskedLength = Math.max(cleaned.length - 4, 4);
  return "*".repeat(maskedLength) + lastFour;
}

/**
 * Generic masking function for any sensitive string data.
 * Shows first 2 and last 2 characters.
 * @param data - The sensitive data to mask
 * @returns Masked string
 */
export function maskData(data: string): string {
  if (data.length <= 4) {
    return "****";
  }
  const start = data.slice(0, 2);
  const end = data.slice(-2);
  const middleLength = data.length - 4;
  return `${start}${"*".repeat(middleLength)}${end}`;
}

/**
 * Sanitizes data before copying to clipboard.
 * Ensures no extra whitespace or unexpected characters.
 * @param data - The data to sanitize
 * @returns Sanitized string
 */
export function sanitizeForClipboard(data: string): string {
  return data.trim().replace(/\s+/g, " ");
}
