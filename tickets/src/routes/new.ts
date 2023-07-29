import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ak-tickets-reuse/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userID: req.currentUser!.id,
    });

    await ticket.save();

    // publish to NATS that a new ticket has been created
    new TicketCreatedPublisher(natsWrapper.client!).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userID,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
