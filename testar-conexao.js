require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para conexões externas na nuvem como o Supabase
});

async function testar() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS horario_atual;');
    console.log('Sucesso! Conectado ao Supabase com horário:', res.rows[0].horario_atual);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
}

testar();