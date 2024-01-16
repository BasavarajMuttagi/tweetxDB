import { Schema, model } from "mongoose";

const uploadProfileSchema = new Schema({
  imageBlob: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const uploadProfileModel = model("ProfilePicture", uploadProfileSchema);

export default uploadProfileModel;
