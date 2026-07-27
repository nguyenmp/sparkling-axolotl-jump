import { defineHandler } from "nitro";
import { getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../db";

export default defineHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const pool = getPool();
  const result = await pool.query("SELECT id, name FROM recipes WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Recipe not found" });
  }

  return result.rows[0];
});
