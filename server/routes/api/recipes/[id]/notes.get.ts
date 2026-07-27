import { defineHandler } from "nitro";
import { getRouterParam, createError } from "nitro/h3";
import { getPool } from "../../../db";

export default defineHandler(async (event) => {
  const recipeId = getRouterParam(event, "id");
  if (!recipeId) throw createError({ statusCode: 400, statusMessage: "id is required" });

  const pool = getPool();
  const result = await pool.query(
    "SELECT id, recipe_id, date_epoch_seconds, content_markdown FROM notes WHERE recipe_id = $1 ORDER BY date_epoch_seconds DESC",
    [recipeId]
  );

  return result.rows;
});
