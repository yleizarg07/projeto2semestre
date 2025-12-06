const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Página inicial dos usuários
router.get('/', usuarioController.pagina);

// Página de login
router.get('/login', usuarioController.mostraLogin);

// Página de cadastro
router.get('/cadastro', usuarioController.mostraCadastro);

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

// Buscar usuários por nome
router.get('/buscar', usuarioController.buscarUsuarios);

//logout
router.get('/logout', usuarioController.logout);

// Página de edição do usuário
router.get('/editar', usuarioController.mostraEditarUsuario);

// Página de perfil social do usuário
router.get('/perfil/:id', usuarioController.verPerfilSocial);

// Listar dados sociais
router.get("/listar/social", usuarioController.listarSocial);

// Formulário para criar dados sociais
router.get("/social/criar", usuarioController.formCriarSocial);

// Página de edição dos dados sociais
router.get('/social/editar/:id', usuarioController.mostraEditarSocial);

// Remover dados sociais
router.get('/social/remover/:id', usuarioController.removerSocial);


module.exports = router;