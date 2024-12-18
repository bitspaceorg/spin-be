import express from "express";
import cookieParser from "cookie-parser";
import { router as authRouter } from "./routes/authRoutes.js";
import { useAuth } from "./middlewares/authMiddleare.js";
import Env from "./config.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.get("/health", useAuth, (req, res) => {
	res.send("ok\n");
});

app.listen(parseInt(Env.PORT), () => {
	console.log(`[INFO] Running on port ${Env.PORT}..`);
});

process.on("SIGTERM", () => {
	console.log(`[INFO] Stopping the server running on port ${Env.PORT}...`);
});
