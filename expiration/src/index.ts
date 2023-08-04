import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async () => {
  //ensure env vars are provided by concerned containers
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

    //listen for events
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
