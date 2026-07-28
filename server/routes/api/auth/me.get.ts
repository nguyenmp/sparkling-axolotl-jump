import { defineHandler } from "nitro";
import { getCookie } from "nitro/h3";
import { createHmac } from "crypto";

const SECRET = "dyad-recipe-journal-internal-secret";

function sign(password: string): string {
  return createHmac("sha256", SECRET).update(password).digest("hex");
}

export default defineHandler(async (event) => {
  const token = getCookie(event, "recipe_auth");
  const password = process.env.NITRO_AUTH_PASSWORD;
  const authenticated = !!(password && token && token === sign(password));
  return { authenticated };
});
