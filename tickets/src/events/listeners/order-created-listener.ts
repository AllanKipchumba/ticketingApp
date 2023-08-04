import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@ak-tickets-reuse/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    //save the ticket
    await ticket.save();

    //emit a ticket updated event for we have updated a record
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
