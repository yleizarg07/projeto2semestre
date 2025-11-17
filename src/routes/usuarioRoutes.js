const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Página inicial dos usuários
router.get('/', usuarioController.pagina);

// Listar usuários (todos ou por ID via query ?id=)
router.get('/listar', usuarioController.listarUsuarios);

// Criar um usuário
router.post('/criar', usuarioController.criarUsuario);

// Criar dados sociais
router.post('/social/criar', usuarioController.criarSocial);

// Atualizar dados sociais
router.post('/social/atualizar/:id', usuarioController.atualizarSocial);

// Atualizar dados principais (nome, nome_usuario, senha)
router.post('/atualizar/:id', usuarioController.atualizarUsuario);

// Remover usuário
router.post('/remover/:id', usuarioController.removerUsuario);

// Login
router.post('/login', usuarioController.login);

module.exports = router;