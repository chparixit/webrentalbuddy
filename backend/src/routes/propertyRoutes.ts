// === Property Routes ===
// Public routes: GET all properties, GET featured, GET by ID
// Admin routes: POST, PUT, DELETE (auth + admin middleware required)
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { upload } from "../middlewares/upload";
import {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controller/propertyController";

import { validate, createPropertyValidation } from "../middlewares/validate";

const router = express.Router();

// Public routes
router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);
router.get("/:id", getPropertyById);

// Admin-only routes (with multi-part form data support for image uploads)
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 10), validate(createPropertyValidation), createProperty);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 10), validate(createPropertyValidation), updateProperty);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProperty);

export default router;