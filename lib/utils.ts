import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import qs from "query-string";

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

// round a value to 2 decimal places
export function roundNumToTwoDp(value: number | string): number {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("The value is not a number or a string");
  }
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

// Define a function formatCurrency that takes an amount as input
// The amount can be of type number, string, or null
// The function returns a formatted currency string or "NaN" if the input is null
const CURRENCY_FORMATTER = Intl.NumberFormat("en-US", {
  currency: "GBP",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

// format the uuid of an order to make it shorter
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// format the date and times to a more readable format
export function formatDateTime(dateString: Date) {
  // date time format options
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // formated date and time
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
}

// form pagination url
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: query,
    },
    {
      skipNull: true,
    }
  );
}
