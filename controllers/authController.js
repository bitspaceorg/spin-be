import db from "../db/user.db.js";
import { checkHash, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { createUserSchema, loginSchema } from "../validators/authValidator.js";

export async function handleLogin(req, res) {
	const user = await req.body;
	try {
		const data = await loginSchema.parseAsync(user);
		const dbUser = await db.getUser(data.email);
		if(!dbUser[0]){
			res.json({
				message: "Invalid User Credentials!",
			});
			return;
		}
		if (!checkHash(data.password, dbUser[0].password)) {
			res.send("Failed to login user!");
			return;
		}
		const token = signToken({
			id: dbUser[0].id,
			role: dbUser[0].role,
		});

		res.cookie("token", token, {
			maxAge: 1000 * 3600, //1 hours
			secure: true,
			httpOnly: true,
		});
		res.json({
			message: "Login Successful!",
		});
	} catch (err) {
		console.error("ERROR: ", err.message);
		res.json({
			message: "Login Failed!",
		});
	}
}

export async function handleSignup(req, res) {
	const user = await req.body;
	try {
		const data = await createUserSchema.parseAsync(user);
		data.password = hashPassword(data.password);
		const id = await db.createUser(
			data.name,
			data.email,
			data.role,
			data.password,
		);
		res.json({
			message: "user created successfully!",
			user_id: id,
		});
	} catch (err) {
		console.error("ERROR: ", err.message,err.code);
		if(err.code=="23505"){
			res.json({
				message: "User Already Exists!",
			});
		}else{
			res.json({
				message: "Failed to Create User!",
			});
		}
	}
}
