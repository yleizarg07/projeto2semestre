const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const comentarioModel = require('../models/comentarioModel');

router.get('/comentarios', comentarioController.listarComentarios);

router.get('/comentarios/criar/:idPost', (req, res) => {
    res.render('pages/criarComentario', { idPost: req.params.idPost, error: null });
});

router.post('/comentarios/criar', comentarioController.criarComentario);

router.get('/comentarios/editar/:id', async (req, res) => {
    const comentario = await comentarioModel.findByPk(parseInt(req.params.id));

    if (!comentario) {
        return res.render('pages/erro', { error: 'Comentário não encontrado.' });
    }

    res.render('pages/editarComentario', { comentario, error: null });
});

router.post('/comentarios/editar/:id', comentarioController.atualizarComentario);

router.post('/comentarios/excluir/:id', comentarioController.excluirComentario);

module.exports = router;
