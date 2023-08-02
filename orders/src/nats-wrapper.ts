/*this function exposes the NATS client instance to the relevant files,
 -index file to  create a  connection
 -all publishers to broadcast an event
 */

import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  //to be exposed to publishers and listeners
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  //the connect method to be exposed to index.js to connect to NATS
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
