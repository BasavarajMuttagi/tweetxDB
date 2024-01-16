const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../..";
import { DecodeOptions, JsonWebTokenError } from "jsonwebtoken";
type tokenType = {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  token = token.split(" ")[1];

  jwt.verify(
    token,
    SECRET_KEY,
    (err:Error, decoded: tokenType) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.body.user = decoded;

      next();
    }
  );
};

export { validateToken };
