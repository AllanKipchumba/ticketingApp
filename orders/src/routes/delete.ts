import { natsWrapper } from "./../../../tickets/src/nats-wrapper";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ak-tickets-reuse/common";
import { OrderCancelledPublisher } from "./../events/publishers/order-cancelled-event";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    //update the order status
    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);

    //publish an event saying this order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
);

export { router as deleteOrderRouter };
