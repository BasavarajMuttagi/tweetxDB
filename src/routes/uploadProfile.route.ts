import express from "express";
import {
  getPicture,
  uploadPicture,
} from "../controllers/uploadProfile.controller";

const UploadProfileRouter = express.Router();

UploadProfileRouter.post("/picture", uploadPicture);
UploadProfileRouter.get("/picture", getPicture);

export { UploadProfileRouter };
