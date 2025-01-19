import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// delay to test loading states
export function createDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
