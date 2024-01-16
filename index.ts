import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { config } from "dotenv";
import { AuthRouter } from "./src/routes/auth.route";
import { UploadProfileRouter } from "./src/routes/uploadProfile.route";
import { PostRouter } from "./src/routes/post.route";
config();

export const PORT = process.env.PORT;
export const STRIPE_KEY = process.env.STRIPE_SECRET as string;
export const SECRET_KEY = process.env.SECRET_KEY as string;
const App = express();
const HttpServer = createServer(App);

App.use(cors());
App.use(bodyParser.json({ limit: "50mb" }));
App.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
App.use("/auth", AuthRouter);
App.use("/upload", UploadProfileRouter);
App.use("/post", PostRouter);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    HttpServer.listen({ port: PORT }, () => {
      console.log(`Server Listening At ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Error");
  });
