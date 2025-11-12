const Post = require('../models/postModel');
const Usuario = require('../models/usuarioModel');
const Comentario = require('../models/comentarioModel');
const bcrypt = require('bcryptjs');

//lista as postagens e pode  filtrar por id, usuario e categoria
async function listarPostagens(req, res) {
    try {
        const { idUsuario, id, categoria } = req.query;
        let postagens = [];

        if (id) {
            const postagem = await Post.findByPk(parseInt(id));
            if (!postagem) {
                return res.render('pages/index', {
                    error: 'Postagem não encontrada',
                    postagens: []
                });
            }
            postagens = [postagem];
        } else {
            const filtros = {};
            if (idUsuario) filtros.postUsuario = parseInt(idUsuario);
            if (categoria) filtros.categoria = categoria;

            postagens = await Post.findAll({ where: filtros });
        }

        return res.render('pages/index', { postagens });
    } catch (error) {
        console.error('Erro ao listar postagens:', error);
        return res.render('pages/erro', {
            postagens: [],
            error: 'Erro ao listar postagens: ' + error.message
        });
    }
}

//cria uma nova postagem
async function criarPostagem(req, res) {
    try {
        const { idUsuario } = req.session;
        const { titulo, conteudo, categoria } = req.body;

        if (!idUsuario) return res.redirect('/login');
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        await Post.create({
            titulo, conteudo, categoria, postUsuario: idUsuario
        });

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao criar postagem: ' + error.message
        });
    }
}

//atualiza uma postagem que ja existe (verifica a senha do usuário)
async function atualizarPostagem(req, res) {
    try {
        const { id } = req.params;
        const { senha, conteudo, categoria } = req.body;
        const { idUsuario } = req.session;

        if (!idUsuario) return res.redirect('/login');
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        const postagem = await Post.findByPk(parseInt(id));
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para editá-la.'
            });
        }

        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta para editar a postagem.' });
        }

        await Post.update(
            { conteudo, categoria },
            { where: { idPost: parseInt(id) } }
        );

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao editar postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao editar postagem: ' + error.message
        });
    }
}

//exclui uma postagem 
async function excluirPostagem(req, res) {
    try {
        const { id } = req.params;
        const { idUsuario } = req.session;

        if (!idUsuario) return res.redirect('/login');

        const postagem = await Post.findByPk(parseInt(id));
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para excluí-la.'
            });
        }

        await Post.destroy({ where: { idPost: parseInt(id) } });

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao excluir postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao excluir postagem: ' + error.message
        });
    }
}

//página principal com todas as postagens
async function pagina(req, res) {
    try {
        const postagens = await Post.findAll();
        return res.render('pages/index', { postagens });
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
        return res.render('pages/index', {
            postagens: [],
            error: 'Erro ao carregar postagens: ' + error.message
        });
    }
}

module.exports = {
    listarPostagens,
    criarPostagem,
    atualizarPostagem,
    excluirPostagem,
    pagina
};