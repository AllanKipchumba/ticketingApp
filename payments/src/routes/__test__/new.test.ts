import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@ak-tickets-reuse/common";

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
