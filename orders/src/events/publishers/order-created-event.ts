import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@ak-tickets-reuse/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
