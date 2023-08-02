import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//desribes the properties required to create a new record
interface TicketAttrs {
  title: string;
  price: number;
  userID: string;
}

//describes the properties that a single record has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userID: string;
  version: number;
}

//describes what the model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

//defines the tickets schema
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    //sanitizes the record to be returned
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// configure updateIfCurrentPlugin to solve OCC - optimistic concurrency control
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

//allows TS to do some type checking on the properties we are using to create a new record
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
