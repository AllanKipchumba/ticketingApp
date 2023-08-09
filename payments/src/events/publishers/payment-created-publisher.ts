import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@ak-tickets-reuse/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
