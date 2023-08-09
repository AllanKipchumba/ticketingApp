import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@ak-tickets-reuse/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();
router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for a cancelled order");
    }

    //cash out with stripe
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
