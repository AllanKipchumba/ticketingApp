import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./errors/notFoundError";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
