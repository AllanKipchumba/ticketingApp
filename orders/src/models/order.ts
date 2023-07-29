import mongoose from "mongoose";
import { OrderStatus } from "@ak-tickets-reuse/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

//desribes the properties required to create a new order
interface OrderAttrs {
  userID: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

//describes the properties that a single order has
interface OrderDoc extends mongoose.Document {
  userID: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

//describes what the model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
