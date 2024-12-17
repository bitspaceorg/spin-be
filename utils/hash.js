import bcrypt from "bcrypt";
import Env from "../config.js";
const saltRounds = Env.SALT_ROUNDS;

/**
 * may throw an error
 * @param {string} password 
 * @returns {string} hashed password
 * */

export function hashPassword(password) {
	const salt= bcrypt.genSaltSync(saltRounds); 
	const hash = bcrypt.hashSync(password,salt);
	return hash;
}

/**
 * @param {string} password 
 * @param {string} hash 
 * @return {boolean}
 * */
export async function checkHash(password,hash) {
	await bcrypt.compare(password,hash,(err,result)=>{
		if(err){
			return false;
		}

		return result;
	})
}
