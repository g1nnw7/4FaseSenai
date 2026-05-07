// src/models/Consulta.js
const db = require('../config/db');

class Consulta {
  static async criar(data, descricao, usuarioId) {
    const texto = `
      INSERT INTO consultas (data, descricao, usuario_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [data, descricao, usuarioId];
    
    const { rows } = await db.query(texto, valores);
    return rows[0];
  }

  static async buscarTodas() {
    const texto = `
      SELECT 
        c.id, c.data, c.descricao, c.criado_em,
        u.nome as usuario_nome, u.email as usuario_email
      FROM consultas c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY c.data ASC;
    `;
    
    const { rows } = await db.query(texto);
    return rows;
  }
}

module.exports = Consulta;