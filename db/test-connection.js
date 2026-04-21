const { loadEnvFile } = require('node:process');
loadEnvFile('.env');

const pool = require('./config');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a PostgreSQL');
    console.log('Hora del servidor de base de datos:', result.rows[0].now);
    await pool.end();
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
  }
}

testConnection();

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT', 
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`Error: La variable de entorno ${varName} no está definida`);
    process.exit(1);
  }
}

console.log('Todas las variables de entorno requeridas están presentes');