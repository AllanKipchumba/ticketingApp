import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@ak-tickets-reuse/common";
import { Ticket } from "../../../models/tickets";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ak-tickets-reuse/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userID: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  //create the fake data
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, orderId, ticket, data, msg };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, orderId, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  //expects the order has been cancelled
  expect(updatedTicket?.orderId).not.toBeDefined();
  //exepect the listener to acknowledge to have received the event
  expect(msg.ack).toHaveBeenCalled();
  //expects the listener to have published a ticket updated event
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
