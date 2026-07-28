import { defineHandler } from "nitro";
import { readBody, getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../../db";
import { requireAuth } from "../../../auth";

export default defineHandler(async (event) => {
  requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const body = await readBody<{ content_markdown?: string }>(event);
  if (!body?.content_markdown) {
    throw createError({ statusCode: 400, statusMessage: "content_markdown is required" });
  }

  const pool = getPool();
  const result = await pool.query(
    "UPDATE notes SET content_markdown = $1 WHERE id = $2 RETURNING id, recipe_id, date_epoch_seconds, content_markdown",
    [body.content_markdown, id]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Note not found" });
  }

  return result.rows[0];
});
