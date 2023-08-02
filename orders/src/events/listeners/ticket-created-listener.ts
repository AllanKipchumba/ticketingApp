import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@ak-tickets-reuse/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queur-group-name";
import { Ticket } from "../../models/ticket";

//listens for new tickets created and saves them to the ticket collection
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    //acknowledge the recipiency of the ticket:created event
    msg.ack();
  }
}
