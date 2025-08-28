import  UserModel  from "../models/userModel";
import {User} from '../types/index'
export class UserService {
  static async getUsers(): Promise<User[]> {
    return await UserModel.getAll();
  }

  static async getUserById(id: number): Promise<User | null> {
    return await UserModel.getById(id);
  }

  static async createUser(user: User): Promise<User> {
    return await UserModel.create(user);
  }

  static async updateUser(id: number, user: User): Promise<User | null> {
    return await UserModel.update(id, user);
  }

  static async deleteUser(id: number): Promise<boolean> {
    return await UserModel.delete(id);
  }

  // 👇 One-to-many join
  static async getUserWithDetails(id: number) {
    return await UserModel.getUserWithDetails(id);
  }
}
