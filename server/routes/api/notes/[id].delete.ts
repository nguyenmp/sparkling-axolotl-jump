import { defineHandler } from "nitro";
import { getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../../db";
import { requireAuth } from "../../../auth";

export default defineHandler(async (event) => {
  requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const pool = getPool();
  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 RETURNING id",
    [id]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" });
  }

  return { deleted: true };
});
