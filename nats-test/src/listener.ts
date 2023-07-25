import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

//clear the console
console.clear();

//initiate a nats client instance
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

//run what is below when client is connected to the NATS streaming server
stan.on("connect", () => {
  console.log("Listener connected to NATS");

  //create a subscription, pass a channel name and a queue group as arguments
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group"
  );

  //listen for new events broadcasted to the channel subscribed
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
