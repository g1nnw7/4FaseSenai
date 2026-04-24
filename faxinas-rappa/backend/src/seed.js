const pool = require('./database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const cltPassword = await bcrypt.hash('clt123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Admin
    const adminResult = await client.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Admin RAPPA', 'admin@rappa.com', $1, 'ADMIN', '(48) 99999-0000')
      ON CONFLICT (email) DO NOTHING RETURNING id;
    `, [adminPassword]);

    // CLT users
    const clt1Result = await client.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Maria Silva', 'maria@rappa.com', $1, 'CLT', '(48) 98888-0001')
      ON CONFLICT (email) DO NOTHING RETURNING id;
    `, [cltPassword]);

    const clt2Result = await client.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('João Santos', 'joao@rappa.com', $1, 'CLT', '(48) 98888-0002')
      ON CONFLICT (email) DO NOTHING RETURNING id;
    `, [cltPassword]);

    // CLT profiles
    if (clt1Result.rows[0]) {
      await client.query(`
        INSERT INTO clt_profiles (user_id, status, bio)
        VALUES ($1, 'disponivel', 'Especialista em limpeza residencial com 5 anos de experiência.')
        ON CONFLICT (user_id) DO NOTHING;
      `, [clt1Result.rows[0].id]);
    }

    if (clt2Result.rows[0]) {
      await client.query(`
        INSERT INTO clt_profiles (user_id, status, bio)
        VALUES ($1, 'disponivel', 'Focado em limpeza comercial e pós-obra.')
        ON CONFLICT (user_id) DO NOTHING;
      `, [clt2Result.rows[0].id]);
    }

    // Regular user
    const userResult = await client.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Carlos Oliveira', 'carlos@email.com', $1, 'USER', '(48) 97777-0001')
      ON CONFLICT (email) DO NOTHING RETURNING id;
    `, [userPassword]);

    await client.query('COMMIT');
    console.log('✅ Seed completed!');
    console.log('📧 Logins:');
    console.log('   ADMIN: admin@rappa.com / admin123');
    console.log('   CLT:   maria@rappa.com / clt123');
    console.log('   CLT:   joao@rappa.com / clt123');
    console.log('   USER:  carlos@email.com / user123');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

seed();