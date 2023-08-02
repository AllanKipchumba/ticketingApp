import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@ak-tickets-reuse/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queur-group-name";
import { Ticket } from "../../models/ticket";

//listens for a ticket that is updated and updates it accordingly in the ticket collection
export class TicketUpdateListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    //acknowlede succesfull processing of the event
    msg.ack();
  }
}
