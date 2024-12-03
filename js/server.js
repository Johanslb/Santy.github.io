const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Configurar Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar conexión a PostgreSQL local
const pool = new Pool({
  user: 'tu_usuario',       // Cambia esto por tu usuario de PostgreSQL
  host: 'localhost',
  database: 'users_db',     // Cambia esto por el nombre de tu base de datos
  password: 'tu_password',  // Tu contraseña de PostgreSQL
  port: 5432,               // Puerto por defecto de PostgreSQL
});

// Configurar conexión a Supabase
const supabaseUrl = 'https://tu_supabase_url';
const supabaseKey = 'tu_supabase_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta para recibir datos del formulario
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Guardar en PostgreSQL local
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, password]
    );

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ first_name: firstName, last_name: lastName, email, password }]);

    if (error) throw error;

    res.status(201).send('Usuario registrado exitosamente.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario.');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
