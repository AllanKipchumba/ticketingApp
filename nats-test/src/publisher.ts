import nats from "node-nats-streaming";
import { TiketCreatedPublisher } from "./events/ticket-created-publisher";

//clear the console
console.clear();

//initiate a NATS client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connecteed to NATS");

  const Publisher = new TiketCreatedPublisher(stan);
  try {
    await Publisher.publish({
      id: "123",
      title: "concerts",
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
});
