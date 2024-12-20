import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		const uploadDir = path.join(__dirname, "uploads");
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
	},
	filename: function(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

export const upload = multer({ storage: storage });
