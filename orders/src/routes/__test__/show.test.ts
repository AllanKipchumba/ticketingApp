import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 30,
  });
  await ticket.save();

  //make a request to build an order with the ticket
  const user = await global.getAuthCookie();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  // expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 30,
  });
  await ticket.save();

  //make a request to build an order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", await global.getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", await global.getAuthCookie())
    .send()
    .expect(401);
});
