import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { validateRequest } from "./../middleware/validateRequest";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";
import { passwordManager } from "../services/passwordManager";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await passwordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //generate jJWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //store it on session object
    // --the cookie session library is going to take the session,
    //---serialize it, and send it back to the user's browser
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
