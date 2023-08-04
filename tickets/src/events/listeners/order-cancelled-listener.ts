import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@ak-tickets-reuse/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("ticketID:", data.ticket.id);

    // const ticket = await Ticket.findById(data.ticket.id);

    // if (!ticket) {
    //   throw new Error("Ticket not found");
    // }

    // ticket.set({ orderId: undefined });
    // await ticket.save();
    // await new TicketUpdatedPublisher(this.client).publish({
    //   id: ticket.id,
    //   version: ticket.version,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userID: ticket.userID,
    //   orderId: ticket.orderId,
    // });

    //ack the message
    msg.ack();
  }
}
