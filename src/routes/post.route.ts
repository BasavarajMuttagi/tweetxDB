import express from "express";
import {
  createNewPost,
  deletePost,
  getAllPosts,
  updatePost,
} from "../controllers/post.controller";
import { validateToken } from "../middlewares/auth.middleware";

const PostRouter = express.Router();

PostRouter.post("/create-post", validateToken, createNewPost);
PostRouter.post("/update-post", validateToken, updatePost);
PostRouter.post("/delete-post", validateToken, deletePost);
PostRouter.get("/getall-post", validateToken, getAllPosts);
export { PostRouter };
