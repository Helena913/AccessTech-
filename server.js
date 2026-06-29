const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',
  database: 'AcessTech',   
  password: 'senai',     
  port: 5432,
});

app.post('/api/configuracoes', async (req, res) => {
  const { cpf, nome, email, tamanhoFonte, temaInterface, comandosVoz } = req.body;


  const query = `
    INSERT INTO configuracoes_usuario (cpf, nome, email, tamanho_fonte, tema_interface, comandos_voz)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (cpf) 
    DO UPDATE SET nome = $2, email = $3, tamanho_fonte = $4, tema_interface = $5, comandos_voz = $6
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [cpf, nome, email, tamanhoFonte, temaInterface, comandosVoz]);
    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao salvar dados de acessibilidade do usuário." });
  }
});


app.put('/api/configuracoes/emergencia', async (req, res) => {
  const { cpf, contatoEmergencia } = req.body;

  const query = `
    UPDATE configuracoes_usuario 
    SET contato_emergencia = $2 
    WHERE cpf = $1 
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [cpf, contatoEmergencia]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "CPF não encontrado no sistema." });
    }
    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao salvar contato de emergência." });
  }
});

app.get('/api/configuracoes/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const query = 'SELECT * FROM configuracoes_usuario WHERE cpf = $1;';

  try {
    const resultado = await pool.query(query, [cpf]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar dados." });
  }
});

app.delete('/api/configuracoes/:cpf', async (req, res) => {
  const { cpf } = req.params;

  const query = `
    DELETE FROM configuracoes_usuario
    WHERE cpf = $1
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [cpf]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    return res.status(200).json({
      mensagem: "Usuário excluído com sucesso.",
      usuario: resultado.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao excluir usuário." });
  }
});

app.listen(3000, () => console.log("Servidor rodando em português na porta 3000! 🚀"));