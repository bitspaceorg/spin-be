import sql from "./db.js";

/**
 * @typedef {Object} User
 * @property {number} id 
 * @property {string} role 
 * @property {string} password 
 * */


export default {
	/**
	 * @param {string} name
	 * @param {string} email
	 * @param {('dean'|'physician'|'nurse'|'administrator'|'finance_manager')} role
	 * @param {string} password
	 *
	 * @returns {Promise<number>} id of the user
	 * */
	createUser: async (name, email, role, password) => {
		const id =
			await sql`insert into users ( name,email,role,password) values( ${name},${email},${role},${password}) returning id`;
		return id[0].id;
	},
	
	/**
	 * @param {string} email
	 * @returns {Promise<User>} user object
	 **/
	getUser: async (email) => {
		const user = sql`select id,role,password from users where email=${email}`
		return user;
	}
};
