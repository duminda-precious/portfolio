import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditional class names with conflict resolution.
 *
 * clsx handles the conditional logic; tailwind-merge resolves collisions so a
 * later class wins over an earlier one of the same property group
 * (`cn("p-2", "p-4")` → `"p-4"`), which is what makes component-level class
 * overrides via props actually work.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
