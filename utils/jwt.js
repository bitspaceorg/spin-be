import Env from "../config.js";
import jwt from "jsonwebtoken";

/**
 * @typedef {Object} JwtPayload
 * @property {number} id
 * @property {string} role
 * */

/**
 * @param {JwtPayload} payload
 * @returns {string} token
 * */
export function signToken(payload) {
	const token = jwt.sign(payload, Env.JWT_KEY, { expiresIn: "6h" });
	return token;
}

/**
 * @param {string} token
 * @returns {JwtPayload}
 * */
export function verifyToken(token) {
	let decoded = jwt.verify(token, Env.JWT_KEY);
	return decoded;
}
