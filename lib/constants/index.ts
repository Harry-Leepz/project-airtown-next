export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Project Airtown";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern e-commerce platform for selling sneakers.";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";

export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const SHIPPING_ADDRESS_FORM_DEFAULTS = {
  fullName: "",
  streetAddress: "",
  townOrCity: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(",").map((m) => m.trim())
  : ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD?.trim() || "Stripe";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
