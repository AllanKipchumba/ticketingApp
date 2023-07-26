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

  //run this code when a client receives an interupt
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  //create a subscription
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created", //channel
    "orders-service-queue-group", //queue group
    options
  );

  //listen for new events broadcasted to the channel subscribed
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    //acknowledge receiving the message and that it has been processed
    msg.ack();
  });
});

//intercept interupt signals to our program
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
