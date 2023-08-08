import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@ak-tickets-reuse/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  //create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userID: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
  });
  await order.save();

  //create mock data to be received by listener
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asdfghjkl",
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("acks the mesage", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
