// src/models/Usuario.js
const db = require('../config/db');

class Usuario {
  
  static async criar(nome, email, senhaCriptografada) {
    const texto = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, perfil;
    `;
    const valores = [nome, email, senhaCriptografada];
    
    const { rows } = await db.query(texto, valores);
    return rows[0];
  }

  // 👉 NOVO MÉTODO: Necessário para o controller achar o usuário no momento do login
  static async buscarPorEmail(email) {
    const texto = `
      SELECT * FROM usuarios 
      WHERE email = $1;
    `;
    const valores = [email];
    
    const { rows } = await db.query(texto, valores);
    return rows[0]; // Retorna o usuário completo (incluindo a senha) para o bcrypt comparar
  }

  static async buscarTodos() {
    const texto = `
      SELECT id, nome, email, perfil 
      FROM usuarios 
      ORDER BY id ASC;
    `;
    const { rows } = await db.query(texto);
    return rows;
  }

  static async atualizar(id, nome, email, perfil) {
    const texto = `
      UPDATE usuarios 
      SET nome = $1, email = $2, perfil = $3
      WHERE id = $4
      RETURNING id, nome, email, perfil;
    `;
    const valores = [nome, email, perfil, id];
    
    const { rows } = await db.query(texto, valores);
    return rows[0];
  }

  static async deletar(id) {
    const texto = `
      DELETE FROM usuarios 
      WHERE id = $1
      RETURNING id;
    `;
    const valores = [id];
    
    const { rows } = await db.query(texto, valores);
    return rows[0];
  }
}

module.exports = Usuario;