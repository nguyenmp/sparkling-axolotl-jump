import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";
import { setAuthCookie } from "../../../auth";

export default defineHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event);
  if (!body?.password) {
    throw createError({ statusCode: 400, statusMessage: "Password is required" });
  }

  const expected = process.env.NITRO_AUTH_PASSWORD;
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: "Server not configured for auth" });
  }

  if (body.password !== expected) {
    throw createError({ statusCode: 401, statusMessage: "Invalid password" });
  }

  setAuthCookie(event);
  return { ok: true };
});
