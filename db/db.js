import postgres from "postgres"
import Env from "../config.js"

const sql = postgres({
	host: Env.POSTGRES_HOST,
	port: 5432,
	username: Env.POSTGRES_USER,
	password: Env.POSTGRES_PASSWORD,
	database: Env.POSTGRES_DBNAME
})


export default sql
