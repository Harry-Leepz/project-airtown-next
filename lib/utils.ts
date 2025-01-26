import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// delay to test loading states
export function createDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// convert prisma object into regular JS object
export function convertToJavaScriptObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format number to two decimal places
export function formatNumberWithDecimal(num: number): string {
  const [integerValue, decimalValue] = num.toString().split(".");
  return decimalValue
    ? `${integerValue}.${decimalValue.padEnd(2, "0")}`
    : `${integerValue}.00`;
}
