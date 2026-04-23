const { loadEnvFile } = require('node:process');
if (process.env.NODE_ENV !== 'production') {
  loadEnvFile('.env');
}

const express = require('express');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const { errorHandler } = require('./src/errorHandler.js');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts'
    }
  });
});

// Middleware de manejo de errores de base de datos
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  // Error de PostgreSQL
  if (err.code) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Registro duplicado' });
    }
    if (err.code === '23503') {
      return res.status(409).json({ error: 'Violación de relación entre tablas' });
    }
    if (err.code === '23502') {
      return res.status(400).json({ error: 'Campo requerido faltante' });
    }
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;