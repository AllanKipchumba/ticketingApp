import mongoose from "mongoose";
import { randomBytes } from "crypto";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper/nats-wrapper";

const start = async () => {
  //ensure env vars are provided by concerned containers
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  //connecg to NATS
  try {
    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
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
