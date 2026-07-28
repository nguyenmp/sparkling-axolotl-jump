import { defineHandler } from "nitro";
import { readBody, getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../../db";
import { requireAuth } from "../../../auth";

export default defineHandler(async (event) => {
  requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const body = await readBody<{ name?: string }>(event);
  if (!body?.name || !body.name.trim()) {
    throw createError({ statusCode: 400, statusMessage: "name is required" });
  }

  const pool = getPool();
  const result = await pool.query(
    "UPDATE recipes SET name = $1 WHERE id = $2 RETURNING id, name",
    [body.name.trim(), id]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Recipe not found" });
  }

  return result.rows[0];
});