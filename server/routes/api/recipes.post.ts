import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";
import { getPool } from "../../db";
import { requireAuth } from "../../auth";

export default defineHandler(async (event) => {
  requireAuth(event);

  const body = await readBody<{ name?: string }>(event);
  if (!body?.name || !body.name.trim()) {
    throw createError({ statusCode: 400, statusMessage: "name is required" });
  }

  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO recipes (name) VALUES ($1) RETURNING id, name",
    [body.name.trim()]
  );

  return result.rows[0];
});