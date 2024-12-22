import express from "express";
export const router = express.Router();
import {
	handleLogin,
	handleLogout,
	handleSignup,
	handleVerify,
} from "../controllers/authController.js";
import { useAuth } from "../middlewares/authMiddleare.js";

router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/verify", useAuth, handleVerify);
router.post("/logout", useAuth, handleLogout);

