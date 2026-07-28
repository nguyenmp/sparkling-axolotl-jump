import { defineHandler } from "nitro";
import { readBody, getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../../../db";
import { requireAuth } from "../../../../auth";

export default defineHandler(async (event) => {
  requireAuth(event);

  const recipeId = getRouterParam(event, "id");
  if (!recipeId) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const body = await readBody<{ content_markdown?: string }>(event);
  if (!body?.content_markdown) {
    throw createError({ statusCode: 400, statusMessage: "content_markdown is required" });
  }

  const pool = getPool();
  const dateEpochSeconds = Math.floor(Date.now() / 1000);
  const result = await pool.query(
    "INSERT INTO notes (recipe_id, date_epoch_seconds, content_markdown) VALUES ($1, $2, $3) RETURNING id, recipe_id, date_epoch_seconds, content_markdown",
    [recipeId, dateEpochSeconds, body.content_markdown]
  );

  return result.rows[0];
});
