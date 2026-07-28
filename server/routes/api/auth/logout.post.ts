import { defineHandler } from "nitro";
import { clearAuthCookie } from "../../../auth";

export default defineHandler(async (event) => {
  clearAuthCookie(event);
  return { ok: true };
});
