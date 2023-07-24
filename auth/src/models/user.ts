import mongoose from "mongoose";
import { passwordManager } from "../services/passwordManager";

//interface describing the properties required to create a new record
interface UserAttrs {
  email: string;
  password: string;
}

//interface describing what a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//interface that describes what properties that a single record has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
}

//define the record schemas
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  //sanitize user data to be returned
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//hash user password
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await passwordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done(); //signals the completion of the pre-save middleware operation
});

//allows TS to do some type checking on the proeerties we are using to create a new record
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//creates the model
export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
