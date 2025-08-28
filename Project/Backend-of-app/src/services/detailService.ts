import  DetailModel  from "../models/detailModel";
import {Detail} from '../types/index'
export class DetailService {
  static async getDetails(): Promise<Detail[]> {
    return await DetailModel.getAll();
  }

  static async getDetailById(id: number): Promise<Detail | null> {
    return await DetailModel.getById(id);
  }

  static async createDetail(detail: Detail): Promise<Detail> {
    return await DetailModel.create(detail);
  }

  static async updateDetail(id: number, detail: Detail): Promise<Detail | null> {
    return await DetailModel.update(id, detail);
  }

  static async deleteDetail(id: number): Promise<boolean> {
    return await DetailModel.delete(id);
  }
}
