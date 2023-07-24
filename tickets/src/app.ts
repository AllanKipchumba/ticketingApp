import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@ak-tickets-reuse/common";
import { json } from "body-parser";
import { createTicketRouter } from "./routes/new";
import { showTicketsRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true); // make express aware that it is behind ingress nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encryption
    //set secure to false when in a test env, otherwise set it to true.
    secure: process.env.NODE_ENV !== "test", //ensure traffic comes from a https
  })
);
//expose the authenticated user to the routes
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketsRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
