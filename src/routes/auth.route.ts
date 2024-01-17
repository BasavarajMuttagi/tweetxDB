import express from "express";
import { validate } from "../middlewares/validation.middleware";
import {
  LoginUser,
  SignUpUser,
  follow,
  getAccountStats,
  getAllFollowers,
  getAllFollowing,
  getAllUsers,
  getFeed,
  unfollow,
} from "../controllers/auth.controller";
import {
  userLoginSchema,
  userSignUpSchema,
} from "../validators/user.validator";
import { validateToken } from "../middlewares/auth.middleware";

const AuthRouter = express.Router();

AuthRouter.post("/signup", validate(userSignUpSchema), SignUpUser);
AuthRouter.post("/login", validate(userLoginSchema), LoginUser);
AuthRouter.get("/users", validateToken, getAllUsers);
AuthRouter.get("/followers", validateToken, getAllFollowers);
AuthRouter.get("/following", validateToken, getAllFollowing);
AuthRouter.post("/follow", validateToken, follow);
AuthRouter.get("/getstats",validateToken,getAccountStats)
AuthRouter.get("/feed",validateToken,getFeed)
AuthRouter.post("/unfollow",validateToken,unfollow)


export { AuthRouter };
