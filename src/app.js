import express from 'express';

const app = express();

app.use(express.json());

app.post('/usuarios', (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ 
      error: 'Nombre y email son requeridos' 
    });
  }

  res.status(201).json({ 
    id: 1, 
    nombre, 
    email 
  });
});

export default app;