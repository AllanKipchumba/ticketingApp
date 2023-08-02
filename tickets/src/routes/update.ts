import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@ak-tickets-reuse/common";
import { Ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from "./../events/publishers/ticket-updated";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) //gt: greater than
      .withMessage("Proce must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    //update the document
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    //publish the update event to NATS
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userID,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
