const comentarioModel = require('../models/comentarioModel');
const postModel = require('../models/postModel');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
//lista comentários e pode filtrar por categoria ou id do post
async function listarComentarios(req, res) {
    try {
        const { categoria, idPost } = req.query;
        let comentarios;

        if (idPost) {
            comentarios = await comentarioModel.findAll({
                where: { comentPost: parseInt(idPost) }
            });
        } else if (categoria) {
            comentarios = await comentarioModel.findAll({
                include: {
                    model: postModel,
                    where: { categoria: categoria },
                }
            });
        } else {
            comentarios = await comentarioModel.findAll();
        }

        res.render('pages/comentarios', { comentarios });
    } catch (error) {
        res.render('pages/comentarios', {
            comentarios: [],
            error: 'Erro ao listar comentários: ' + error.message
        });
    }
}

//cria novo comentário
async function criarComentario(req, res) {
    try {
        const { idUsuario } = req.session;
        const { idPost, conteudo } = req.body;

        if (!idUsuario) {
            return res.redirect('/login');
        }

        if (!conteudo || conteudo.trim() === '' || !idPost) {
            return res.render('pages/criarComentario', {
                error: 'Conteúdo e ID da Postagem são obrigatórios.'
            });
        }

        const postagem = await postModel.findByPk(parseInt(idPost));
        if (!postagem) {
            return res.render('pages/criarComentario', {
                error: 'Postagem não encontrada.'
            });
        }

        await comentarioModel.create({
            conteudo: conteudo,
            comentPost: parseInt(idPost),
            comentUsua: idUsuario
        });

        return res.redirect(`/postagem/${idPost}`);
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao criar comentário: ' + error.message
        });
    }
}

//atualiza comentário existente e exige senha do usuário
async function atualizarComentario(req, res) {
    try {
        const { id } = req.params;
        const { senha, conteudo } = req.body;
        const { idUsuario } = req.session;

        if (!idUsuario) {
            return res.redirect('/login');
        }

        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo é obrigatório.' });
        }

        const comentario = await comentarioModel.findByPk(parseInt(id));
        if (!comentario || comentario.comentUsua !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Comentário não encontrado ou sem permissão.'
            });
        }

        const usuario = await usuarioModel.findByPk(idUsuario);
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta.' });
        }

        await comentario.update({ conteudo: conteudo });

        return res.redirect(`/postagem/${comentario.comentPost}`);
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao atualizar comentário: ' + error.message
        });
    }
}

//exclui um comentário
async function excluirComentario(req, res) {
    try {
        const { id } = req.params;
        const { idUsuario } = req.session;

        if (!idUsuario) {
            return res.redirect('/login');
        }

        const comentario = await comentarioModel.findByPk(parseInt(id));
        if (!comentario || comentario.comentUsua !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Comentário não encontrado ou sem permissão.'
            });
        }

        const idPost = comentario.comentPost;
        await comentario.destroy();

        return res.redirect(`/postagem/${idPost}`);
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao excluir comentário: ' + error.message
        });
    }
}

module.exports = {
    listarComentarios,
    criarComentario,
    atualizarComentario,
    excluirComentario
};
