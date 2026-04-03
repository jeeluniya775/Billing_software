const { Pool } = require('pg');

const DATABASE_URL = "postgresql://avnadmin:AVNS_GIqYSQhXNng3oBRtZiY@pg-2b841aed-jeelpatel1817-9116.h.aivencloud.com:12223/defaultdb?sslmode=require";

async function testConnection() {
  console.log('Testing connection to:', DATABASE_URL.split('@')[1]);
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
