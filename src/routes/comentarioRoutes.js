const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.get('/comentarios', comentarioController.listarComentarios);

router.get('/comentarios/criar/:idPost', (req, res) => {
    const { idPost } = req.params;
    res.render('pages/criarComentario', { idPost, error: null });
});
router.post('/comentarios/criar', comentarioController.criarComentario);

router.get('/comentarios/editar/:id', async (req, res) => {
    const comentarioModel = require('../models/comentarioModel');

    const comentario = await comentarioModel.findByPk(parseInt(req.params.id));

    if (!comentario) {
        return res.render('pages/erro', {
            error: 'Comentário não encontrado.'
        });
    }

    res.render('pages/editarComentario', { comentario, error: null });
});

router.post('/comentarios/editar/:id', comentarioController.atualizarComentario);

router.post('/comentarios/excluir/:id', comentarioController.excluirComentario);

module.exports = router;
