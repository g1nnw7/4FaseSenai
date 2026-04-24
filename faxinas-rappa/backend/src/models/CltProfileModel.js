const pool = require('../config/db.js');

class CltProfileModel {
  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT cp.*, u.name, u.email, u.phone
       FROM clt_profiles cp
       INNER JOIN users u ON cp.user_id = u.id
       WHERE cp.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  static async updateStatus(userId, status) {
    const result = await pool.query(
      `UPDATE clt_profiles SET status = $1, updated_at = NOW()
       WHERE user_id = $2
       RETURNING *`,
      [status, userId]
    );
    return result.rows[0] || null;
  }

  static async updateProfile(userId, { bio, avatar_url }) {
    const result = await pool.query(
      `UPDATE clt_profiles SET bio = $1, avatar_url = $2, updated_at = NOW()
       WHERE user_id = $3
       RETURNING *`,
      [bio, avatar_url, userId]
    );
    return result.rows[0] || null;
  }

  static async createIfNotExists(userId) {
    const result = await pool.query(
      `INSERT INTO clt_profiles (user_id, status)
       VALUES ($1, 'disponivel')
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = CltProfileModel;