const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Página inicial de usuários
router.get('/', usuarioController.pagina);

// Listar usuários
router.get('/listar', usuarioController.listarUsuarios);

// Criar novo usuário
router.post('/criar', usuarioController.criarUsuario);

// Login de usuário
router.post('/login', usuarioController.login);

// Atualizar usuário
router.post('/atualizar/:id', usuarioController.atualizarUsuario);

// Remover usuário
router.get('/remover/:id', usuarioController.removerUsuario);

module.exports = router;
