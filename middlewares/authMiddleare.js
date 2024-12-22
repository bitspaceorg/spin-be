import { verifyToken } from "../utils/jwt.js";

export const useAuth = (req, res, next) => {
	const token = req.cookies.token;
	if (!token || token == "") {
		res.status(400).json({
			message: "Invalid Login!",
		});
		return;
	}
	try {
		req.user = verifyToken(token);
	} catch (err) { 
		res.cookie("token", {});
		res.status(400).json({
			message: "Invalid Login!",
		});
		return;
	}
	next();
};
