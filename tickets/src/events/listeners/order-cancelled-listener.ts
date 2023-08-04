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
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: undefined });

    //save the ticket
    await ticket.save();

    //emit a ticket updated event for we have updated the ticket record
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userID,
      orderId: ticket.orderId,
    });

    //ack the message
    msg.ack();
  }
}
