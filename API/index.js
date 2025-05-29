const express = require('express');
const fs = require('fs');
const path = require('path');
const server = express();

server.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

function lerDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return { jogadores: [], idAtual: 1 };
    }
}

function salvarDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}


server.post('/jogadores', (req, res) => {
  console.log('Body recebido:', req.body); 
  const db = lerDB();
  const { nome, idade, posicao, imagem } = req.body;
  const novoJogador = { id: db.idAtual++, nome, idade, posicao, imagem };
  db.jogadores.push(novoJogador);
  salvarDB(db);
  res.status(201).json(novoJogador);
});


server.get('/jogadores', (req, res) => {
    const db = lerDB();
    res.json(db.jogadores);
});


server.get('/jogadores/:id', (req, res) => {
    const db = lerDB();
    const id = parseInt(req.params.id);
    const jogador = db.jogadores.find(j => j.id === id);
    if (!jogador) {
        return res.status(404).json({ erro: 'Jogador não encontrado' });
    }
    res.json(jogador);
});


server.put('/jogadores/:id', (req, res) => {
    const db = lerDB();
    const id = parseInt(req.params.id);
    const jogador = db.jogadores.find(j => j.id === id);
    if (!jogador) {
        return res.status(404).json({ erro: 'Jogador não encontrado' });
    }

    const { nome, idade, posicao, imagem } = req.body;
    jogador.nome = nome ?? jogador.nome;
    jogador.idade = idade ?? jogador.idade;
    jogador.posicao = posicao ?? jogador.posicao;
    jogador.imagem = imagem ?? jogador.imagem;

    salvarDB(db);
    res.json(jogador);
});


server.delete('/jogadores/:id', (req, res) => {
    const db = lerDB();
    const id = parseInt(req.params.id);
    const index = db.jogadores.findIndex(j => j.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: 'Jogador não encontrado' });
    }

    db.jogadores.splice(index, 1);
    salvarDB(db);
    res.status(204).send();
});


server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
