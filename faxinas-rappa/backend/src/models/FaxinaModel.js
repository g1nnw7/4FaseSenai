const pool = require('../config/db.js');

class FaxinaModel {
  static async findAll(filters = {}) {
    let query = `
      SELECT f.*,
             u.name as user_name, u.email as user_email, u.phone as user_phone,
             c.name as clt_name, c.email as clt_email, c.phone as clt_phone,
             cp.status as clt_status,
             a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.zip_code
      FROM faxinas f
      INNER JOIN users u ON f.user_id = u.id
      LEFT JOIN users c ON f.clt_id = c.id
      LEFT JOIN clt_profiles cp ON f.clt_id = cp.user_id
      LEFT JOIN addresses a ON f.address_id = a.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.userId) {
      query += ` AND f.user_id = $${paramCount++}`;
      params.push(filters.userId);
    }
    if (filters.cltId) {
      query += ` AND f.clt_id = $${paramCount++}`;
      params.push(filters.cltId);
    }
    if (filters.status) {
      query += ` AND f.status = $${paramCount++}`;
      params.push(filters.status);
    }
    if (filters.date) {
      query += ` AND f.scheduled_date = $${paramCount++}`;
      params.push(filters.date);
    }

    query += ` ORDER BY f.scheduled_date ASC, f.scheduled_time ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT f.*,
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              c.name as clt_name, c.email as clt_email, c.phone as clt_phone,
              cp.status as clt_status,
              a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.zip_code
       FROM faxinas f
       INNER JOIN users u ON f.user_id = u.id
       LEFT JOIN users c ON f.clt_id = c.id
       LEFT JOIN clt_profiles cp ON f.clt_id = cp.user_id
       LEFT JOIN addresses a ON f.address_id = a.id
       WHERE f.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUserId(userId) {
    return this.findAll({ userId });
  }

  static async findByCltId(cltId) {
    return this.findAll({ cltId });
  }

  // Check if CLT already has a faxina at given date/time
  static async checkCltConflict(cltId, scheduledDate, scheduledTime, excludeId = null) {
    let query = `
      SELECT id FROM faxinas
      WHERE clt_id = $1
        AND scheduled_date = $2
        AND scheduled_time = $3
        AND status NOT IN ('cancelada', 'concluida')
    `;
    const params = [cltId, scheduledDate, scheduledTime];

    if (excludeId) {
      query += ` AND id != $4`;
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  // Check if USER already has a faxina at given date/time
  static async checkUserConflict(userId, scheduledDate, scheduledTime, excludeId = null) {
    let query = `
      SELECT id FROM faxinas
      WHERE user_id = $1
        AND scheduled_date = $2
        AND scheduled_time = $3
        AND status NOT IN ('cancelada', 'concluida')
    `;
    const params = [userId, scheduledDate, scheduledTime];

    if (excludeId) {
      query += ` AND id != $4`;
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  static async create({ userId, cltId, addressId, scheduledDate, scheduledTime, durationHours, propertyType, squareMeters, observations, price }) {
    const result = await pool.query(
      `INSERT INTO faxinas (user_id, clt_id, address_id, scheduled_date, scheduled_time, duration_hours, property_type, square_meters, observations, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [userId, cltId, addressId, scheduledDate, scheduledTime, durationHours, propertyType, squareMeters, observations, price]
    );
    return result.rows[0];
  }

  static async update(id, fields) {
    const allowedFields = ['clt_id', 'address_id', 'scheduled_date', 'scheduled_time', 'duration_hours', 'status', 'property_type', 'square_meters', 'observations', 'price'];
    const updates = [];
    const params = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramCount++}`);
        params.push(value);
      }
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const result = await pool.query(
      `UPDATE faxinas SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );
    return result.rows[0] || null;
  }

  static async cancel(id) {
    const result = await pool.query(
      `UPDATE faxinas SET status = 'cancelada', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Can cancel if more than 24h before scheduled
  static canCancel(scheduledDate, scheduledTime) {
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    const diffHours = (scheduledDateTime - now) / (1000 * 60 * 60);
    return diffHours > 24;
  }
}

module.exports = FaxinaModel;