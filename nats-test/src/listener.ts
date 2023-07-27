import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListner } from "./events/ticket-created-listener";

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

  //listen for events
  new TicketCreatedListner(stan).listen();
});

//intercept interupt signals to our program
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
