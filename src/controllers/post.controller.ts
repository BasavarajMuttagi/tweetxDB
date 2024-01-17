import { Request, Response } from "express";

import UserModel from "../models/user.model";
import PostModel from "../models/post.model";
import { date } from "zod";

const createNewPost = async (req: Request, res: Response) => {
  try {
    const {
      content,
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }
    const newPostRecord = await PostModel.create({ userId, email, content });
    await UserModel.updateOne(
      { email },
      { $push: { posts: newPostRecord._id } }
    );
    res.status(201).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const {
      content,
      _id,
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const newPostRecord = await PostModel.findOne({ _id });
    if (!newPostRecord) {
      res.status(409).send({ message: "Post Not Found!" });
      return;
    }
    await PostModel.updateOne({ _id }, { content });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};
const deletePost = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    if (user.posts.length == 0) {
      res.status(409).send({ message: "Not Post Found!" });
      return;
    }
    if (user && user.posts.length > 0) {
      await UserModel.updateOne({ email }, { $pull: { posts: _id } });
      res.sendStatus(201);
    }
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      user: { email, userId },
    } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    if (user.posts.length == 0) {
      res.status(200).send({ posts: [], message: "Not Post Found!" });
      return;
    }
    if (user && user.posts.length > 0) {
      const record = await UserModel.findOne({ email })
        .populate({
          path: "posts",
          options: { sort: { createdAt: -1 }, populate: { path: "userId" ,select:"-password"} },
        })
        .select("posts");



      res.status(200).send({ message: "Success", posts: record?.posts });
    }
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};


export { createNewPost, updatePost, deletePost, getAllPosts };
