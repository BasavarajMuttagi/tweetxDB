import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).send({ error: error });
    }
  };
};

export { validate };