import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpException } from "../exceptions/HttpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";

class AuthService {
  public users = UserModel;

  public async signup(userData: {
    email: string;
    name: string;
    password: string;
  }): Promise<User> {
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists`
      );
    const reg = new RegExp("^(?=.*[a-zA-Z])(?=.*d).{8,12}$");
    if (!reg.test(userData.password)) {
      throw new HttpException(403, "Invalid Password format");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async login(userData: {
    email: string;
    password: string;
  }): Promise<{ token: string; findUser: User }> {
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser)
      throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password
    );

    if (!isPasswordMatching)
      throw new HttpException(409, "You're password not matching");

    const { token } = this.createToken(findUser);

    return { token, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (!findUser)
      throw new HttpException(409, `You're email ${userData.email} not found`);

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = process.env.SECRET_KEY;
    const expiresIn: number = 4 * 60 * 60 * 1000;

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }
}

export default AuthService;
