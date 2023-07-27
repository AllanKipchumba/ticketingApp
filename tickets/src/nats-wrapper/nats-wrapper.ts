import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
}

export const natsWrapper = new NatsWrapper();
