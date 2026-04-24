const pool = require('../config/db.js');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findAll() {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at,
              cp.status as clt_status, cp.bio, cp.avatar_url
       FROM users u
       LEFT JOIN clt_profiles cp ON u.id = cp.user_id
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at,
              cp.status as clt_status, cp.bio, cp.avatar_url
       FROM users u
       LEFT JOIN clt_profiles cp ON u.id = cp.user_id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT u.*, cp.status as clt_status, cp.bio
       FROM users u
       LEFT JOIN clt_profiles cp ON u.id = cp.user_id
       WHERE u.email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async findByRole(role) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at,
              cp.status as clt_status, cp.bio, cp.avatar_url
       FROM users u
       LEFT JOIN clt_profiles cp ON u.id = cp.user_id
       WHERE u.role = $1
       ORDER BY u.name ASC`,
      [role]
    );
    return result.rows;
  }

  static async findAvailableCLTs() {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone,
              cp.status as clt_status, cp.bio, cp.avatar_url
       FROM users u
       INNER JOIN clt_profiles cp ON u.id = cp.user_id
       WHERE u.role = 'CLT' AND cp.status = 'disponivel'
       ORDER BY u.name ASC`
    );
    return result.rows;
  }

  static async create({ name, email, password, role = 'USER', phone }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO users (name, email, password, role, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role, phone, created_at`,
        [name, email, hashedPassword, role, phone]
      );

      const user = result.rows[0];

      if (role === 'CLT') {
        await client.query(
          `INSERT INTO clt_profiles (user_id, status) VALUES ($1, 'disponivel')`,
          [user.id]
        );
      }

      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, { name, email, phone }) {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, role, phone, updated_at`,
      [name, email, phone, id]
    );
    return result.rows[0] || null;
  }

  static async updatePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
      [hashedPassword, id]
    );
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;