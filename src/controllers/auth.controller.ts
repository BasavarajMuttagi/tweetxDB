import { Request, Response } from "express";
import UserModel from "../models/user.model";
import * as bcrypt from "bcrypt";
import { decode, sign } from "jsonwebtoken";
const SignUpUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      res.status(409).send({ message: "Account Exists!" });
      return;
    }
    const encryprtedPassword = await bcrypt.hash(password, 10);
    const record = await UserModel.create({
      ...req.body,
      password: encryprtedPassword,
    }).then(() => {
      res.status(201).send({ message: "Account Created SuccessFully!" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordMatch) {
      res.status(400).send({ message: "email or password incorrect" });
      return;
    }
    const token = sign(
      {
        userId: user?._id,
        email,
        name: user.name,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "2h" }
    );
    res.status(200).send({ email, token: token, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const {
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const record = await UserModel.find({ _id: { $ne: userId } }).select([
      "_id",
      "name",
      "email",
    ]);

    res.status(200).send({ users: record, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getAllFollowers = async (req: Request, res: Response) => {
  try {
    const {
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const record = await UserModel.findOne({ email })
      .populate({
        path: "followers",
        select: "_id name email",
      })
      .select("following");

    res.status(200).send({ followers: record?.followers, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getAllFollowing = async (req: Request, res: Response) => {
  try {
    const {
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const record = await UserModel.findOne({ email })
      .populate({
        path: "following",
        select: "_id name email",
      })
      .select("following");

    res.status(200).send({ following: record?.following, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const follow = async (req: Request, res: Response) => {
  try {
    const {
      userIdToBeFollowed,
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }
    const RecordOfUserIdToBeFollowed = await UserModel.findOne({
      _id: userIdToBeFollowed,
    });

    if (!RecordOfUserIdToBeFollowed) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }



    if(user?.following?.includes(userIdToBeFollowed)){
      res.status(409).send({ message: "Already Followed" });
      return;
    }


    await UserModel.updateOne(
      { email },
      { $push: { following: userIdToBeFollowed } }
    );

    await UserModel.updateOne(
      { _id: userIdToBeFollowed },
      { $push: { followers: userId } }
    );

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getAccountStats = async (req: Request, res: Response) => {
  try {
    const {
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const record = await UserModel.aggregate([
      { $match: { email } },
      {
        $project: {
          name: 1,
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          postsCount: { $size: "$posts" },
        },
      },
    ]);

    res.status(200).send({ stats: record[0], message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getFeed = async (req: Request, res: Response) => {
  try {
    const {
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    const record = await UserModel.findOne({ email })
      .populate({
        path: "following",
        select: "_id name email posts",
        populate: {
          path: "posts",
          select: "content",
        },
      })
      .select("following");

    res.status(200).send({ feed: record, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const unfollow = async (req: Request, res: Response) => {
  try {
    const {
      userIdToBeUnFollowed,
      user: { email, userId },
    } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }
    const RecordOfUserIdToBeUnFollowed = await UserModel.findOne({
      _id: userIdToBeUnFollowed,
    });

    if (!RecordOfUserIdToBeUnFollowed) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    await UserModel.updateOne(
      { email },
      { $pull: { following: userIdToBeUnFollowed } }
    );

    await UserModel.updateOne(
      { _id: userIdToBeUnFollowed },
      { $pull: { followers: userId } }
    );

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

export {
  SignUpUser,
  LoginUser,
  getAllUsers,
  getAllFollowers,
  getAllFollowing,
  follow,
  getAccountStats,
  getFeed,
  unfollow,
};
