import { OrderStatus } from "@ak-tickets-reuse/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//attributes required to crate an order
interface OrderAttrs {
  id: string;
  version: number;
  userID: string;
  price: number;
  status: OrderStatus;
}

//attribites that every order document should have
interface OrderDoc extends mongoose.Document {
  version: number;
  userID: string;
  price: number;
  status: OrderStatus;
}

//defines methods that the Order model would have
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

//automanage versioning
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

//defines what happens when you call .build method on the model
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userID: attrs.userID,
    price: attrs.price,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
