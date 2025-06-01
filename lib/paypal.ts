const PAYPAL_API_BASE_URL =
  process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {};

// generate access token for paypal
async function generateAccessToken() {
  // get client id and secret from environment variables
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.access_token;
  } else {
    const errorText = await response.text();
    throw new Error(
      `Failed to generate access token: ${response.status} - ${errorText}`
    );
  }
}
