import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ak-tickets-reuse/common";
// import { param } from "express-validator";
// import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

// const isValidObjectId = (input: string) =>
//   mongoose.Types.ObjectId.isValid(input);
// const validateObjectId = param("")
//   .not()
//   .isEmpty()
//   .custom(isValidObjectId)
//   .withMessage("Order must be a valid ObjectId");

router.get(
  "/api/orders/:orderId",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
