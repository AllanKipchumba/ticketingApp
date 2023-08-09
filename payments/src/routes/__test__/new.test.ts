import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@ak-tickets-reuse/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

//mock the stripe client
// jest.mock("../../stripe.ts");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.getAuthCookie())
    .send({
      token: "asdfghjkl",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userID: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 20,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.getAuthCookie())
    .send({
      token: "asdfghjkl",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userID,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 20,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.getAuthCookie(userID))
    .send({
      token: "asdfghjkl",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userID,
    version: 0,
    status: OrderStatus.Created,
    price,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.getAuthCookie(userID))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  //implementation using the real version of stripe
  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge?.currency).toEqual("usd");

  const payment = Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge?.id,
  });

  expect(payment).not.toBeNull();

  /*Implementation using a mocked version of stripe
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
  */
});
