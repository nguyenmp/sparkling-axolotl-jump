import { defineHandler } from "nitro";
import { getPool } from "../../db";

export default defineHandler(async () => {
  const pool = getPool();
  const result = await pool.query(
    "SELECT id, name FROM recipes ORDER BY name ASC"
  );
  return result.rows;
});
