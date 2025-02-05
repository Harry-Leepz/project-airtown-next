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

// handle errors relating to zod and prisma to improve error messaging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // handle zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
