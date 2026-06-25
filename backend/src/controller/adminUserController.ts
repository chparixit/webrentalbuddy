// === Admin User Management Controller ===
// 5 endpoints: GET all (paginated/search), GET by id, POST create, PUT update, DELETE
import { Request, Response } from "express";
import * as adminUserService from "../services/adminUser.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string) || "";

    const result = await adminUserService.getUsers({ page, limit, search });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await adminUserService.getUserById(req.params.id);
    return res.status(200).json({ data: user });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, status } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const user = await adminUserService.createUser({ name, email, password, role, status });
    return res.status(201).json({ data: user, message: "User created successfully" });
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, status } = req.body;

    const updatedUser = await adminUserService.updateUser(req.params.id, {
      name,
      email,
      password,
      role,
      status,
    });

    return res.status(200).json({ data: updatedUser, message: "User updated successfully" });
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Email already in use") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await adminUserService.deleteUser(req.params.id);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};