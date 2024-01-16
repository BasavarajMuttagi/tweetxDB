import { Request, Response } from "express";
import UserModel from "../models/user.model";
import uploadProfileModel from "../models/uploadProfile.model";

const uploadPicture = async (req: Request, res: Response) => {
  try {
    const { imageBlob, userId, email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }

    await uploadProfileModel
      .create({
        imageBlob: imageBlob,
        userId,
      })
      .then(() => {
        console.log("Success");
      })
      .catch(() => {
        console.log("Failed Upload");
      });

    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

const getPicture = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.authorization;
    const record = await uploadProfileModel.findOne({ userId });

    res
      .status(200)
      .send({ imageBase64: record?.imageBlob, message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Error Occured , Please Try Again!" });
  }
};

export { uploadPicture, getPicture };
