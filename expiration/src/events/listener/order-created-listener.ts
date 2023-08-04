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

  /**Do the following when an order:created event is recorded:
   * 1 - enque the job (a trigger to flag the order as expired)
   * 2 - wait for a set delay to process the response sent from the queue
   */
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting ${delay} many milliseconds to process the job`, delay);

    //enque  a job
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 10000, //process the response from bull after a set delay
      }
    );

    msg.ack();
  }
}
