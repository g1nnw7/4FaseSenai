const pool = require('../config/db.js');

class AddressModel {
  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM addresses WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create({ userId, street, number, complement, neighborhood, city, state, zipCode }) {
    const result = await pool.query(
      `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, zip_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, street, number, complement, neighborhood, city, state, zipCode]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      `DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}

module.exports = AddressModel;