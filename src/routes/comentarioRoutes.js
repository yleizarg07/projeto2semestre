const express = require('express');
const router = express.Router();

const comentarioController = require('../controllers/comentarioController');

// Rota para listar comentários
router.get('/', comentarioController.listarComentarios);

// Rota para criar novo comentário
router.post('/criar', comentarioController.criarComentario);

// Rota para atualizar um comentário existente
router.post('/atualizar/:id', comentarioController.atualizarComentario);

// Rota para excluir um comentário
router.post('/excluir/:id', comentarioController.excluirComentario);

module.exports = router;