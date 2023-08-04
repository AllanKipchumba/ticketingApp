import Queue from "bull";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("orde:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//runs when we receive a job
expirationQueue.process(async (job) => {
  console.log("publish expiration complete event");
});

export { expirationQueue };
