import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@ak-tickets-reuse/common";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    //generate jJWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    //store it on session object
    // --the cookie session library is going to take the session,
    //---serialize it, and send it back to the user's browser
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
