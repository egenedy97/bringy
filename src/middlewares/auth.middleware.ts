import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "../exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interface";
import { UserModel } from "../models/user.model";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (Authorization) {
      const secretKey: string = process.env.SECRET_KEY;
      const verificationResponse = (await jwt.verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await UserModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export default authMiddleware;
