import { z } from "zod";

/**
 * @param {string} err
 * @returns {string}
 * */ export const formatValidationError = (err) => {
  let errMsg = "";
  for (let errL of JSON.parse(err)) {
    errMsg += errL.message;
    errMsg += ",";
  }
  return errMsg;
};

export const createUserSchema = z.object({
  name: z.string().min(6),
  email: z.string().email(),
  role: z.enum([
    "dean",
    "physician",
    "nurse",
    "administrator",
    "finance_manager",
  ]),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email Required" })
    .email({ message: "should be a valid email" }),
  password: z
    .string({
      message: "Password Required",
    })
    .min(8, { message: "password should be 8 characters" }),
});
