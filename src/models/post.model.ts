import { Schema, model } from "mongoose";

const userPostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PostModel = model("Post", userPostSchema);

export default PostModel;
