import { Request, Response } from 'express';    
import UserModel from '../models/userModel';

//Get all users
const getUsers = async (req: Request, res: Response) => {
    try{
        const users = await UserModel.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// Get all user by Id
const getUserById = async (req: Request, res: Response) => {
    try{
        const user = await UserModel.getById(Number(req.params.id));
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//create new user
const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//update user
const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserModel.update(Number(req.params.id), req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await UserModel.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
    }
};
const getUserWithDetails = async (req: Request, res: Response) => {
    try{
        const user = await UserModel.getUserWithDetails(Number(req.params.id));
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    }catch(err){
        res.status(500).json({ error: "Error fetching user details" });
    }
}



export default {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserWithDetails
};