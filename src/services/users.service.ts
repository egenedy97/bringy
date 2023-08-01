import bcrypt from "bcryptjs";
import { HttpException } from "../exceptions/HttpException";
import { User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";

class UserService {
  public users = UserModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists`
      );

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async updateUser(
    userId: string,
    userData: { name: string; email: string; password: string }
  ): Promise<User> {
    if (userData.email) {
      const findUser: User = await this.users.findOne({
        email: userData.email,
      });
      if (findUser && findUser._id != userId)
        throw new HttpException(
          409,
          `You're email ${userData.email} already exists`
        );
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, {
      userData,
    });
    if (!updateUserById) throw new HttpException(409, "You're not user");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  }
}

export default UserService;
