import nats from "node-nats-streaming";

//clear the console
console.clear();

//initiate a NATS client --a nats instance
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//run what is below when client is connected to the NATS streaming server
stan.on("connect", () => {
  console.log("Publisher connecteed to NATS");

  //create message to share as an event
  const data = JSON.stringify({
    id: "123",
    title: "concerts",
    price: 20,
  });

  //publish the event to the specified channel
  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
