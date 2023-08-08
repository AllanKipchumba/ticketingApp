import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ak-tickets-reuse/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      id,
      version,
      userID,
      status,
      ticket: { price },
    } = data;

    const order = Order.build({
      id,
      version,
      userID,
      price,
      status,
    });

    await order.save();

    msg.ack();
  }
}
