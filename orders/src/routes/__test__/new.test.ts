import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../__mocks__/nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.getAuthCookie())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userID: "asdfghjkl",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

// it("emmits an order created event", async () => {
//   const ticket = Ticket.build({
//     title: "concert",
//     price: 20,
//   });
//   await ticket.save();

//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", await global.getAuthCookie())
//     .send({ ticketId: ticket.id })
//     .expect(201);

//   // expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
