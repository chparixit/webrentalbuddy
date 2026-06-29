// === Admin User Management Routes ===
// All routes are protected by JWT auth + admin authorization
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/adminUserController";

const router = express.Router();

// All admin routes require both JWT auth AND admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/v1/admin/users - List all users (paginated, searchable)
router.get("/", getAllUsers);

// GET /api/v1/admin/users/:id - Get single user
router.get("/:id", getUserById);

// POST /api/v1/admin/users - Create new user
router.post("/", createUser);

// PUT /api/v1/admin/users/:id - Update user
router.put("/:id", updateUser);
router.patch("/:id", updateUser);

// DELETE /api/v1/admin/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;