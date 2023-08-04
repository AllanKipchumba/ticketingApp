import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ak-tickets-reuse/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
