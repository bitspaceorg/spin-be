import FabricUploader from "../utils/fabric_uploader.js";
import path from "path";
import fs from "fs";

export const handleUpload = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		if(!req.body.type){
			return res.status(400).json({ error: "Upload type not found" });
		}

		if (path.extname(req.file.originalname).toLowerCase() !== ".json") {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({ error: "Only JSON files are allowed" });
		}

		const uploader = FabricUploader.getInstance();

		await uploader.upload(req.file.path,req.body.type);

		fs.unlinkSync(req.file.path);

		res.json({
			message: "Upload Success!",
		});
	} catch (error) {
		console.error("Upload error:", error);
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		res.status(500).json({
			error: "Upload failed",
			details: error.message || "Unknown error occurred",
		});
	}
};
