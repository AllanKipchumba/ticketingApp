import {
  Listener,
  Subjects,
  OrderCreatedEvent,
} from "@ak-tickets-reuse/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //enque  a job
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
