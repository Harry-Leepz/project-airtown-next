import { generateAccessToken } from "../lib/paypal";

// test for generating access token
test("generate access token from paypal", async () => {
  const accessToken = await generateAccessToken();
  console.log("Access Token:", accessToken);

  expect(accessToken).toBeDefined();
  expect(typeof accessToken).toBe("string");
  expect(accessToken.length).toBeGreaterThan(0);
});
