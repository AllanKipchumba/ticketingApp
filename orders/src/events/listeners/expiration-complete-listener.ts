import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@ak-tickets-reuse/common";
import { queueGroupName } from "./queur-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-event";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    //publish an event communicating that an order has been cancelled
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    //finally acknowledge event recipiency
    msg.ack();
  }
}
