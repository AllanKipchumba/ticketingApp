import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdateListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

const start = async () => {
  //ensure env vars are provided by concerned containers
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  //connecg to NATS
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    /**
     * Gracefull shutdown
     * when a client receives an interupt
     * intercept interupt signals to our program
     */
    natsWrapper.client!.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client!.close());
    process.on("SIGTERM", () => natsWrapper.client!.close());

    //listen for traffic published to the channels the service is subscribed to
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdateListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

    //initiate database connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
