import mongoose from "mongoose";

//interface describing the properties required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

//interface describing what a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//interface that describes what properties that a single user has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
