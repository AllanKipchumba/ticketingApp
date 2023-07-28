import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ak-tickets-reuse/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
