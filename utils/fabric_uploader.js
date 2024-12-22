import "dotenv/config";
import { ConfidentialClientApplication } from "@azure/msal-node";
import axios from "axios";
import path from "path";
import fs from "fs";
import Env from "../config.js";
import logger from "./logger.js";

export default class FabricUploader {
	static instance = null;

	/**
	 * @param {string} clientId
	 * @param {string} clientSecret
	 * @param {string} tenantId
	 * @param {string} username
	 * @param {string} password
	 * @param {string} onelakeUrl
	 * */
	constructor(
		clientId,
		clientSecret,
		tenantId,
		username,
		password,
		onelakeUrl,
	) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.tenantId = tenantId;
		this.username = username;
		this.password = password;
		this.authority = `https://login.microsoftonline.com/${this.tenantId}`;
		this.scopes = ["https://storage.azure.com/.default"];
		this.onelakeUrl = onelakeUrl;
		this.client = new ConfidentialClientApplication({
			auth: {
				clientId: this.clientId,
				authority: this.authority,
				clientSecret: this.clientSecret,
			},
		});
	}

	async getToken() {
		try {
			const tokenResponse = await this.client.acquireTokenByUsernamePassword({
				username: this.username,
				password: this.password,
				scopes: this.scopes,
			});
			return tokenResponse.accessToken;
		} catch (error) {
			console.error("Error getting access token:", error);
			throw error;
		}
	}
	/**
	 * @returns {FabricUploader} a instance of the uploader class */
	static getInstance() {
		if (FabricUploader.instance) {
			return FabricUploader.instance;
		}

		FabricUploader.instance = new FabricUploader(
			Env.AZURE_CLIENTID,
			Env.AZURE_CLIENTSECRET,
			Env.AZURE_TENANTID,
			Env.AZURE_USERNAME,
			Env.AZURE_PASSWORD,
			Env.AZURE_ONELAKEURL,
		);

		return FabricUploader.instance;
	}

	/**
	 * @param {string} filePath - path of the file to be uploaded
	 * @param {string} folderName - name of the folder to be uploaded
	 * @param {boolean} vectorUpload - set to true to upload to vectorDb
	 * */
	async upload(filePath, folderName, vectorUpload = false) {
		try {
			const fileName = path.basename(filePath);
			const fileContent = fs.readFileSync(filePath);
			const stats = fs.statSync(filePath);

			const uploadUrl = `${this.onelakeUrl}/${folderName}/${fileName}`;

			const accessToken = await this.getToken();

			//creation
			await axios({
				method: "put",
				url: uploadUrl + "?resource=file",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"x-ms-date": new Date().toUTCString(),
					"x-ms-version": "2020-04-08",
				},
			});

			//append NOTE: no file greater than 10mb
			await axios({
				method: "patch",
				url: `${uploadUrl}?action=append&position=0`,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Length": stats.size,
					"Content-Type": "application/octet-stream",
				},
				data: fileContent,
				maxContentLength: Infinity,
				maxBodyLength: Infinity,
			});

			//flush

			await axios({
				method: "patch",
				url: `${uploadUrl}?action=flush&position=${stats.size}`,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Length": 0,
				},
			});

			logger.info("Uploaded File to onelake");

			if (vectorUpload) {
				//vectroDB upload
				const jsonData = JSON.parse(fileContent);
				const concatenatedString = Object.entries(jsonData)
					.map(([key, value]) => `${key}: ${value}`)
					.join("\n");
				await axios({
					method: "post",
					url: Env.BACKEND_URL+"/ingest",
					data: {
						content: concatenatedString,
						doctype: folderName != "health" ? "finance" : "health",
					},
				});
				logger.info("Uploaded File to vectordb");
			}
		} catch (err) {
			logger.error(err.message);
		}
	}
}
