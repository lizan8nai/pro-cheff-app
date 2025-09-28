import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de forma segura (tailwind-first) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}