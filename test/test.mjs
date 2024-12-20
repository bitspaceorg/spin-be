import "dotenv/config";
import FabricUploader from "../utils/fabric_uploader.js";
import Env from "../config.js";
import assert from "assert";

describe("Should upload a file", () => {
	it("Should Upload a file", async () => {
		const uploader = new FabricUploader(
			Env.AZURE_CLIENTID,
			Env.AZURE_CLIENTSECRET,
			Env.AZURE_TENANTID,
			Env.AZURE_USERNAME,
			Env.AZURE_PASSWORD,
			Env.AZURE_ONELAKEURL,
		);
		const res = await uploader.getToken();
		assert.notEqual("", res);
		try {
			await uploader.upload("./mock/data.json");
		} catch (err) {
			console.log(err);
			return;
		}
	});

	it("Should upload using singleton", async () => {
		const uploader = FabricUploader.getInstance();
		await uploader.upload("./mock/data.json", "bills");
	});

	it("Should upload to health", async () => {
		const uploader = FabricUploader.getInstance();
		await uploader.upload("./mock/data.json", "health");
	});

	it("Should upload to vectorDb", async () => {
		const uploader = FabricUploader.getInstance();
		await uploader.upload("./mock/data.json", "health", true);
	});
});
