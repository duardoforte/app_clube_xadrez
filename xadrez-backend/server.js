const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração de conexão com o seu PostgreSQL
const pool = new Pool({
  user: 'postgres', // Seu usuário do banco
  host: 'localhost',
  database: 'xadrez_clube', // O banco que criamos
  password: '1234', // <--- COLOQUE SUA SENHA DO POSTGRES AQUI
  port: 5432,
});

// Rota para Cadastrar novo usuário
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { 
      res.status(400).json({ erro: 'Este e-mail já está em uso.' });
    } else {
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
});

// Rota para Fazer Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );
    
    if (result.rows.length > 0) {
      res.status(200).json({ mensagem: 'Login com sucesso!', usuario: result.rows[0] });
    } else {
      res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// Liga o servidor na porta 3000
app.listen(3000, () => {
  console.log('♟️ Servidor do Clube de Xadrez rodando na porta 3000!');
});