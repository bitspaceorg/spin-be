import express from "express";
import cookieParser from "cookie-parser";
import { router as authRouter } from "./routes/authRoutes.js";
import { useAuth } from "./middlewares/authMiddleare.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.get("/health", useAuth, (req, res) => {
	res.send("ok\n");
});

app.listen(3000, () => {
	console.log("Running on port 3000..");
});
