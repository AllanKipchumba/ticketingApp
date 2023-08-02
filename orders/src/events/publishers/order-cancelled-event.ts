import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@ak-tickets-reuse/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
