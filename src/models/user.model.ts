import { Schema, model } from "mongoose";
import { string } from "zod";

const userSignUpSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
    profile: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSignUpSchema);

export default UserModel;
