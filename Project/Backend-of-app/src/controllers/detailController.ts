import { Request, Response } from "express";
import  DetailModel  from "../models/detailModel";
import { DetailService } from "../services/detailService";

// Get all details
const getDetails = async (req: Request, res: Response) => {
  try {
    const details = await DetailModel.getAll();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: "Error fetching details" });
  }
};
// Get detail by ID

const getDetailsById = async (req: Request, res: Response) => {
  try {
    const detail = await DetailModel.getById(Number(req.params.id));
    if (!detail) return res.status(404).json({ error: "Detail not found" });
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: "Error fetching detail" });
  }
};
//Create detail
const createDetail = async (req: Request, res: Response) => {
  try {
    const newDetail = await DetailModel.create(req.body);
    res.status(201).json(newDetail);
  } catch (err) {
    res.status(500).json({ error: "Error creating detail" });
  }
};
// Update detail
const updateDetail = async (req: Request, res: Response) => {
  try {
    const updatedDetail = await DetailModel.update(Number(req.params.id), req.body);
    if (!updatedDetail) return res.status(404).json({ error: "Detail not found" });
    res.json(updatedDetail);
  } catch (err) {
    res.status(500).json({ error: "Error updating detail" });
  }
};
//Delete detail
const deleteDetail = async (req: Request, res: Response) => {
  try {
    const deleted = await DetailModel.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Detail not found" });
    res.json({ message: "Detail deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting detail" });
  }
};


export default {
    getDetails,
    getDetailsById,
    createDetail,
    updateDetail,
    deleteDetail
}