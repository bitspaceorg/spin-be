import express from "express";
import { handleUpload } from "../controllers/uploadController.js";
export const router = express.Router();

router.post("/file", handleUpload);
