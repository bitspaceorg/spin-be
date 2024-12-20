import Env from "./config.js";
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { router as authRouter } from "./routes/authRoutes.js";
import { router as uploadRouer } from "./routes/uploadRoutes.js";
import { useAuth } from "./middlewares/authMiddleare.js";
import { upload } from "./middlewares/uploadMiddleware.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/upload", useAuth, upload.single("file"), uploadRouer);

app.get("/health", useAuth, (req, res) => {
  res.send("ok\n");
});

app.listen(parseInt(Env.PORT), () => {
  console.log(`[INFO] Running on port ${Env.PORT}..`);
});

process.on("SIGTERM", () => {
  console.log(`[INFO] Stopping the server running on port ${Env.PORT}...`);
});
