import "dotenv/config"
import { z } from "zod";

const envSchema = z.object({
	POSTGRES_HOST: z.string().min(3),
	POSTGRES_PASSWORD: z.string().min(3),
	POSTGRES_USER: z.string().min(3),
	POSTGRES_DBNAME: z.string().min(3),
	SALT_ROUNDS: z.number(),
	JWT_KEY:z.string(),
	CERBROS_URL:z.string(),
	PORT:z.string().max(4).min(4)
});

const Env = {
	POSTGRES_HOST: process.env.POSTGRES_HOST,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_DBNAME: process.env.POSTGRES_DBNAME,
	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
	JWT_KEY:process.env.JWT_KEY,
	CERBROS_URL:process.env.CERBROS_URL,
	PORT:process.env.PORT
}

envSchema.parse(Env);

export default Env;
