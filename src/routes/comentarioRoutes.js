const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const comentarioModel = require('../models/comentarioModel');

//Listar comentários 
router.get('/', comentarioController.listarComentarios);

// ormulário de criação para um post específico
router.get('/criar/:idPost', (req, res) => {
    res.render('pages/criarComentario', { idPost: req.params.idPost, error: null });
});

//Criar comentário
router.post('/criar', comentarioController.criarComentario);

//Editar comentário 
router.get('/editar/:id', async (req, res) => {
    const comentario = await comentarioModel.findByPk(parseInt(req.params.id));
    if (!comentario) {
        return res.render('pages/erro', { error: 'Comentário não encontrado.' });
    }
    res.render('pages/editarComentario', { comentario, error: null });
});

//Atualizar e Excluir
router.post('/editar/:id', comentarioController.atualizarComentario);
router.post('/excluir/:id', comentarioController.excluirComentario);

module.exports = router;
