import db from "../db/user.db.js";
import { checkHash, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import {
	createUserSchema,
	formatValidationError,
	loginSchema,
} from "../validators/authValidator.js";
import logger from "../utils/logger.js";

export async function handleVerify(req, res) {
	return res.status(200).json({
		message: "Valid user!",
		data: {
			id: req.user.id,
			role: req.user.role,
		},
	});
}

export async function handleLogout(req, res) {
	res.clearCookie("token");
	return res.status(200).json({
		message: "Logout Successful!",
	});
}
export async function handleLogin(req, res) {
	const user = await req.body;
	try {
		let data;
		try {
			data = await loginSchema.parseAsync(user);
		} catch (err) {
			throw new Error(formatValidationError(err.message));
		}
		const dbUser = await db.getUser(data.email);
		if (!dbUser[0]) {
			res.status(400).json({
				message: "Invalid User Credentials!",
			});
			return;
		}
		if (!checkHash(data.password, dbUser[0].password)) {
			res.status(400).send("Failed to login user!");
			return;
		}
		const token = signToken({
			id: dbUser[0].id,
			role: dbUser[0].role,
		});

		res.cookie("token", token, {
			maxAge: 1000 * 3600, //1 hours
			secure: false,
			httpOnly: false,
			sameSite: "lax",
		});

		logger.info(`${dbUser[0].id} Logged in`);
		res.json({
			message: "Login Successful!",
			data: {
				id: dbUser[0].id,
				role: dbUser[0].role,
			},
		});
	} catch (err) {
		logger.error(err.message);
		res.status(400).json({
			message: "Login Failed!",
			data: err.message,
		});
	}
}

export async function handleSignup(req, res) {
	const user = await req.body;
	try {
		let data;
		try {
			data = await createUserSchema.parseAsync(user);
		} catch (err) {
			throw new Error(formatValidationError(err.message));
		}
		data.password = hashPassword(data.password);
		const id = await db.createUser(
			data.name,
			data.email,
			data.role,
			data.password,
		);

		logger.info("User Created", data.email);
		res.status(201).json({
			message: "user created successfully!",
			user_id: id,
		});
	} catch (err) {
		logger.error(err.message);
		if (err.code == "23505") {
			res.status(400).json({
				message: "User Already Exists!",
			});
		} else {
			res.status(400).json({
				message: "Failed to Create User!",
				data: err.message,
			});
		}
	}
}
