export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Project Airtown";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern e-commerce platform for selling sneakers.";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";

export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const SHIPPING_ADDRESS_FORM_DEFAULTS = {
  fullName: "Jane Smith",
  streetAddress: "21 Bedford Road",
  townOrCity: "Bedford",
  postalCode: "MK1 5JS",
  country: "England",
};
