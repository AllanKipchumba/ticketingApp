import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var getAuthCookie: (id?: string) => Promise<string[]>;
}

//mock nats-wrapper
jest.mock("../nats-wrapper.ts");

//to run before all the tests -- set up a mondoDB instance
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdgfjkl";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

//to run before each test -- clear collections
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany();
  }
});

//to run after all tests -- stop thr mongoDB istance
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

//declares a global function accecible to all test cases
global.getAuthCookie = async (id?: string) => {
  //this service has no access to the signup api. we need to fake authentication
  //build a jwt payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build a session object
  const session = { jwt: token };

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take the json and encode it as base 64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats a cookie with the encoded data
  return [`session=${base64}`];
};
