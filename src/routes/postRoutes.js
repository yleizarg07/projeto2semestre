const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

// Página principal
router.get('/', postController.pagina);

// Listar postagens
router.get('/listar', postController.listarPostagens);

// Criar nova postagem
router.post('/criar', postController.criarPostagem);

// Atualizar uma postagem existente (precisa do ID)
router.post('/atualizar/:id', postController.atualizarPostagem);

// Excluir uma postagem (precisa do ID)
router.post('/excluir/:id', postController.excluirPostagem);

module.exports = router;
