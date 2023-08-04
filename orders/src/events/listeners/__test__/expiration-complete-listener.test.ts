import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@ak-tickets-reuse/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  //connect with the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create an order
  const order = Order.build({
    status: OrderStatus.Created,
    userID: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  //fake data
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { msg, data, order, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an order cancelled event", async () => {
  const { msg, data, order, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { msg, data, order, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
