const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const Post = require('../models/postModel');


router.get('/', postController.pagina);

router.get('/postagens', postController.listarPostagens);

router.get('/postagens/criar', (req, res) => {
    const { idUsuario } = req.session;

    if (!idUsuario) return res.redirect('/login');

    res.render('pages/criarPostagem', { error: null });
});

router.post('/postagens/criar', postController.criarPostagem);

router.get('/postagens/editar/:id', async (req, res) => {
    const postagem = await Post.findByPk(parseInt(req.params.id));

    if (!postagem) {
        return res.render('pages/erro', {
            error: 'Postagem não encontrada.'
        });
    }

    res.render('pages/editarPostagem', { postagem, error: null });
});

router.post('/postagens/editar/:id', postController.atualizarPostagem);

router.post('/postagens/excluir/:id', postController.excluirPostagem);

module.exports = router;