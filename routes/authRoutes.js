import express from "express";
export const router = express.Router();
import { handleLogin, handleSignup } from "../controllers/authController.js";

router.post("/login", handleLogin);
router.post("/signup", handleSignup);
