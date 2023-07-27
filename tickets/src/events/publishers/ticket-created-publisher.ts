import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@ak-tickets-reuse/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
