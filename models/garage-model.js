const pool = require("../database/")

/* ***************************
 * Add vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.favorite (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    // If already existed, rows[0] will be undefined but that's fine for our use
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Get all favorites for a user
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT
        f.favorite_id,
        f.created_at,
        i.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price,
        i.inv_thumbnail
      FROM public.favorite AS f
      JOIN public.inventory AS i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Remove a favorite for this user/vehicle
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM public.favorite
      WHERE account_id = $1 AND inv_id = $2;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data
  } catch (error) {
    throw error
  }
}

/* ***************************
 * Check if a vehicle is a favorite for this user
 * ************************** */
async function isFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT favorite_id
      FROM public.favorite
      WHERE account_id = $1 AND inv_id = $2;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    throw error
  }
}

module.exports = { addFavorite, getFavoritesByAccountId, removeFavorite, isFavorite }
