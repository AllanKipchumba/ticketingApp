import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@ak-tickets-reuse/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "src/models/ticket";
import { Order } from "src/models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    //find the ticket the user is trying to order in DB
    const ticket = await Ticket.findById({ ticketId });
    if (!ticket) {
      throw new NotAuthorizedError();
    }

    //make sure the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //calculate the expiration date for thid order

    //build the order and save it to the database

    //publish an event saying that an order was created

    res.send({});
  }
);

export { router as newOrderRouter };
