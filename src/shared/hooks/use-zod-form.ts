/**
 * Custom hook for Zod-validated forms using React Hook Form.
 * Provides type-safe form validation with runtime checks.
 */

import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Enhanced useForm hook with Zod validation
 * @param schema - Zod schema for validation
 * @param options - Additional React Hook Form options
 * @returns Form methods with full type safety
 */
export function useZodForm<TOutput extends FieldValues>(
  schema: z.ZodType<TOutput>,
  options?: Omit<UseFormProps<TOutput>, "resolver">
) {
  return useForm<TOutput>({
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    mode: options?.mode ?? "onBlur",
  });
}

/**
 * Helper to extract error message from Zod validation
 */
export function getZodErrorMessage(error: z.ZodError, field: string): string | undefined {
  const fieldError = error.issues.find((err) => err.path.join(".") === field);
  return fieldError?.message;
}

/**
 * Validate data against a Zod schema and return typed result
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Safe parse with default value
 */
export function parseWithDefault<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
}
