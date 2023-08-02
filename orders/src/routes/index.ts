import express, { Request, Response } from "express";
import { requireAuth } from "@ak-tickets-reuse/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  //shows all the orders belonging to a particular user
  const orders = await Order.find({
    userID: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
