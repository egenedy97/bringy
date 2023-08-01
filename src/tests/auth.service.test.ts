import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthService from "../services/auth.service";
import { HttpException } from "../exceptions/HttpException";
import { User } from "../interfaces/user.interface";
import { IUser, UserModel } from "../models/user.model";
import { Model, Types, Document } from "mongoose";

jest.mock("../models/user.model");

const mockedUserModel = UserModel as jest.Mocked<
  Model<
    IUser,
    {},
    {},
    {},
    Document<unknown, {}, IUser> & IUser & { _id: Types.ObjectId },
    any
  >
>;
jest.mock("jsonwebtoken");
const mockedJwtSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>;

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe("signup", () => {
    it("should create a new user and return the user data", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "validPArd123",
      };
      const hashedPassword = "hashedPassword";
      const createdUser: any = {
        ...userData,
        _id: "64c83aaa7f4fc1cc59f510bf",
        password: hashedPassword,
      };

      mockedUserModel.findOne.mockResolvedValue(null);

      mockedUserModel.create.mockResolvedValue(createdUser);
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      const result = await authService.signup(userData);

      expect(result).toEqual(createdUser);
      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(mockedUserModel.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });

    it("should throw HttpException with status 409 if user already exists", async () => {
      const userData = {
        email: "existing@example.com",
        name: "Existing User",
        password: "validpassword123",
      };
      mockedUserModel.findOne.mockResolvedValue({} as User);

      await expect(authService.signup(userData)).rejects.toThrow(
        new HttpException(409, `You're email ${userData.email} already exists`)
      );
    });
  });

  describe("login", () => {
    it("should log in the user and return the token and user data", async () => {
      const userData = {
        email: "test@example.com",
        password: "validpassword123",
      };
      const findUser: User = {
        _id: "mocked_id",
        email: userData.email,
        name: "Test User",
        password: "hashedPassword",
      };
      const token = "mocked_token";

      mockedUserModel.findOne.mockResolvedValue(findUser);

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const expiresIn = 4 * 60 * 60 * 1000;
      mockedJwtSign.mockReturnValue(undefined);

      mockedJwtSign.mockImplementationOnce((_data, _secret, options) => {
        expect(options.expiresIn).toBe(expiresIn);
        return token;
      });

      const result = await authService.login(userData);

      expect(result).toEqual({ token, findUser });
      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        findUser.password
      );
      expect(mockedJwtSign).toHaveBeenCalled();
    });

    it("should throw HttpException with status 409 if user does not exist", async () => {
      const userData = {
        email: "nonexistent@example.com",
        password: "validpassword123",
      };

      mockedUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login(userData)).rejects.toThrow(
        new HttpException(409, `You're email ${userData.email} not found`)
      );
    });

    it("should throw HttpException with status 409 if password does not match", async () => {
      const userData = {
        email: "test@example.com",
        password: "invalidpassword",
      };
      const findUser: User = {
        _id: "mocked_id",
        email: userData.email,
        name: "Test User",
        password: "hashedPassword",
      };

      mockedUserModel.findOne.mockResolvedValue(findUser);

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(authService.login(userData)).rejects.toThrow(
        new HttpException(409, "You're password not matching")
      );
    });
  });

  describe("logout", () => {
    it("should log out the user and return the user data", async () => {
      const userData: User = {
        _id: "mocked_id",
        email: "test@example.com",
        name: "Test User",
        password: "hashedPassword",
      };

      mockedUserModel.findOne.mockResolvedValue(userData);

      const result = await authService.logout(userData);

      expect(result).toEqual(userData);
      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
    });

    it("should throw HttpException with status 409 if user does not exist", async () => {
      const userData: User = {
        _id: "mocked_id",
        email: "nonexistent@example.com",
        name: "Nonexistent User",
        password: "hashedPassword123",
      };

      mockedUserModel.findOne.mockResolvedValue(null);

      await expect(authService.logout(userData)).rejects.toThrow(
        new HttpException(409, `You're email ${userData.email} not found`)
      );
    });
  });
});
