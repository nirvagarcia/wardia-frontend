/**
 * Authentication utilities and helpers
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Validate phone format (supports international formats)
 */
export function validatePhone(phone: string): boolean {
  return /^\+?[\d\s\-()]+$/.test(phone);
}

/**
 * Calculate password strength (0-5)
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}

/**
 * Get password strength label key for i18n
 * Returns translation key based on strength
 */
export function getPasswordStrengthLabelKey(strength: number): string {
  const keys = [
    "",
    "auth.passwordStrengthVeryWeak",
    "auth.passwordStrengthWeak",
    "auth.passwordStrengthMedium",
    "auth.passwordStrengthStrong",
    "auth.passwordStrengthVeryStrong"
  ];
  return keys[strength] || "";
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = ["", "text-red-600", "text-orange-600", "text-yellow-600", "text-lime-600", "text-green-600"];
  return colors[strength] || "";
}

/**
 * Format validation errors for display
 */
export function formatValidationError(field: string, error: string): string {
  return error;
}

