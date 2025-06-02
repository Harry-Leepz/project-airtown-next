import { generateAccessToken, paypal } from "../lib/paypal";

// test for generating access token
test("generate access token from paypal", async () => {
  const accessToken = await generateAccessToken();

  expect(accessToken).toBeDefined();
  expect(typeof accessToken).toBe("string");
  expect(accessToken.length).toBeGreaterThan(0);
});

// test to create a paypal order
test("create paypal order", async () => {
  const price = 10.0;
  const order = await paypal.createOrder(price);

  expect(order).toBeDefined();
  expect(order).toHaveProperty("id");
  expect(order).toHaveProperty("status");
  expect(order.status).toBe("CREATED");
});

// test to capture a paypal payment
test("capture a paypal payment with a mock order", async () => {
  const mockOrderId = "mock-order-id";
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(mockOrderId);

  expect(mockCapturePayment).toHaveBeenCalledWith(mockOrderId);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayment.mockRestore();
});
