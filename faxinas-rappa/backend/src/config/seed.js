const pool = require('./db.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Limpa na ordem correta (FK)
    await client.query('DELETE FROM faxinas');
    await client.query('DELETE FROM addresses');
    await client.query('DELETE FROM clt_profiles');
    await client.query('DELETE FROM users');

    console.log('🗑️  Dados anteriores removidos.');

    // ─── ADMIN ───────────────────────────────────────────────
    const adminPass = await bcrypt.hash('admin123', SALT_ROUNDS);
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password, role, phone)
       VALUES ('Admin RAPPA', 'admin@rappa.com', $1, 'ADMIN', '(48) 99999-0000')
       RETURNING id`,
      [adminPass]
    );

    // ─── CLT 1 — disponivel ──────────────────────────────────
    const clt1Pass = await bcrypt.hash('clt123', SALT_ROUNDS);
    const clt1Result = await client.query(
      `INSERT INTO users (name, email, password, role, phone)
       VALUES ('Maria Silva', 'maria@rappa.com', $1, 'CLT', '(48) 98888-0001')
       RETURNING id`,
      [clt1Pass]
    );
    const clt1Id = clt1Result.rows[0].id;

    await client.query(
      `INSERT INTO clt_profiles (user_id, status, bio)
       VALUES ($1, 'disponivel', 'Especialista em limpeza residencial com 5 anos de experiência.')`,
      [clt1Id]
    );

    // ─── CLT 2 — indisponivel ────────────────────────────────
    const clt2Pass = await bcrypt.hash('clt123', SALT_ROUNDS);
    const clt2Result = await client.query(
      `INSERT INTO users (name, email, password, role, phone)
       VALUES ('João Santos', 'joao@rappa.com', $1, 'CLT', '(48) 98888-0002')
       RETURNING id`,
      [clt2Pass]
    );
    const clt2Id = clt2Result.rows[0].id;

    await client.query(
      `INSERT INTO clt_profiles (user_id, status, bio)
       VALUES ($1, 'indisponivel', 'Focado em limpeza comercial e pós-obra.')`,
      [clt2Id]
    );

    // ─── USER ─────────────────────────────────────────────────
    const userPass = await bcrypt.hash('user123', SALT_ROUNDS);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role, phone)
       VALUES ('Carlos Oliveira', 'carlos@email.com', $1, 'USER', '(48) 97777-0001')
       RETURNING id`,
      [userPass]
    );
    const userId = userResult.rows[0].id;

    // ─── Endereço do USER ─────────────────────────────────────
    const addrResult = await client.query(
      `INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, zip_code)
       VALUES ($1, 'Rua das Flores', '123', 'Apto 2', 'Centro', 'Florianópolis', 'SC', '88010-000')
       RETURNING id`,
      [userId]
    );
    const addrId = addrResult.rows[0].id;

    // ─── Faxinas de exemplo ───────────────────────────────────
    await client.query(
      `INSERT INTO faxinas (user_id, clt_id, address_id, scheduled_date, scheduled_time, duration_hours, property_type, square_meters, observations, status)
       VALUES ($1, $2, $3, CURRENT_DATE + INTERVAL '3 days', '09:00', 3, 'residencial', 80, 'Trazer produto para vidros.', 'agendada')`,
      [userId, clt1Id, addrId]
    );

    await client.query(
      `INSERT INTO faxinas (user_id, clt_id, address_id, scheduled_date, scheduled_time, duration_hours, property_type, square_meters, status)
       VALUES ($1, $2, $3, CURRENT_DATE, '08:00', 4, 'comercial', 150, 'em_andamento')`,
      [userId, clt1Id, addrId]
    );

    await client.query(
      `INSERT INTO faxinas (user_id, clt_id, address_id, scheduled_date, scheduled_time, duration_hours, property_type, status, price)
       VALUES ($1, $2, $3, CURRENT_DATE - INTERVAL '7 days', '10:00', 3, 'residencial', 'concluida', 180.00)`,
      [userId, clt1Id, addrId]
    );

    await client.query(
      `INSERT INTO faxinas (user_id, clt_id, address_id, scheduled_date, scheduled_time, duration_hours, property_type, status)
       VALUES ($1, $2, $3, CURRENT_DATE - INTERVAL '2 days', '14:00', 2, 'residencial', 'cancelada')`,
      [userId, clt2Id, addrId]
    );

    await client.query('COMMIT');

    console.log('\n✅ Seed concluído!\n');
    console.log('┌──────────┬──────────────────────┬──────────┐');
    console.log('│ Role     │ Email                │ Senha    │');
    console.log('├──────────┼──────────────────────┼──────────┤');
    console.log('│ ADMIN    │ admin@rappa.com       │ admin123 │');
    console.log('│ CLT      │ maria@rappa.com       │ clt123   │');
    console.log('│ CLT      │ joao@rappa.com        │ clt123   │');
    console.log('│ USER     │ carlos@email.com      │ 
        user123  │');
    console.log('└──────────┴──────────────────────┴──────────┘');
    console.log('\n📋 Faxinas do Carlos: agendada | em_andamento | concluida | cancelada\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed falhou:', error.message);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

seed();