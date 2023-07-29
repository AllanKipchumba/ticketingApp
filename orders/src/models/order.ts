import mongoose from "mongoose";

//desribes the properties required to create a new record
interface OrderAttrs {
  userID: string;
  status: string;
  expiresAt: Date;
  ticket: TIcketDoc;
}

//describes the properties that a single record has
interface OrderDoc extends mongoose.Document {
  userID: string;
  status: string;
  expiresAt: Date;
  ticket: TIcketDoc;
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
