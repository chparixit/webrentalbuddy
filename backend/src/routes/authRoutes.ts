import express from "express";
import { register, login, whoami, updateProfile, updatePassword } from "../controller/authController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";
import { validate, registerValidation, loginValidation } from "../middlewares/validate";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

// Protected routes
router.get("/whoami", authMiddleware, whoami);
router.put("/update", authMiddleware, upload.single("profileImage"), updateProfile);
router.put("/update-password", authMiddleware, updatePassword);

export default router;
