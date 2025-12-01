const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const Post = require('../models/postModel');

//Lista principal de posts 
router.get('/', postController.pagina);

//Listar posts com filtros
router.get('/listar', postController.listarPostagens);

//Formulário de criação (GET) e criação (POST)
router.get('/criar', (req, res) => {
    const { idUsuario } = req.session;
    if (!idUsuario) return res.redirect('/usuarios/login');
    res.render('pages/criarPostagem', { error: null });
});
router.post('/criar', postController.criarPostagem);

//Editar ou excluir por id
router.get('/editar/:id', async (req, res) => {
    const postagem = await Post.findByPk(parseInt(req.params.id));
    if (!postagem) {
        return res.render('pages/erro', { error: 'Postagem não encontrada.' });
    }
    res.render('pages/editarPostagem', { postagem, error: null });
});
router.post('/editar/:id', postController.atualizarPostagem);
router.post('/excluir/:id', postController.excluirPostagem);

router.get('/:id', postController.exibirPost);


module.exports = router;