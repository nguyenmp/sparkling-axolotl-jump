import { createHmac } from "crypto";
import { getCookie, setCookie, deleteCookie, createError } from "nitro/h3";
import type { H3Event } from "nitro/h3";

const SECRET = "dyad-recipe-journal-internal-secret";

function sign(password: string): string {
  return createHmac("sha256", SECRET).update(password).digest("hex");
}

export function requireAuth(event: H3Event): void {
  const token = getCookie(event, "recipe_auth");
  const password = process.env.NITRO_AUTH_PASSWORD;
  if (!password || !token || token !== sign(password)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}

export function setAuthCookie(event: H3Event): void {
  const password = process.env.NITRO_AUTH_PASSWORD;
  if (!password) {
    throw createError({ statusCode: 500, statusMessage: "Server not configured for auth" });
  }
  setCookie(event, "recipe_auth", sign(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, "recipe_auth", { path: "/" });
}
