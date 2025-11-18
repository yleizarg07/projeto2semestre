const path = require('path');
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const PostModel = require('../models/postModel');
const ComentarioModel = require('../models/comentarioModel');

//lista as postagens e pode filtrar por id, usuario e categoria
async function listarPostagens(req, res) {
    try {
        const { id, categoria } = req.query; //requisição do id do usuário, do id da postagem e da categoria
        let postagens;

        if (id) {
            const postagem = await PostModel.findByPk(parseInt(id)); //procura a postagem pelo id
            if (!postagem) {
                return res.render('pages/index', {
                    error: 'Postagem não encontrada',
                });
            }
        } else if (categoria) {
            postagens = await PostModel.findAll({
                where: { categoria }, //mostra por categoria
            });
        } else {
            postagens = await PostModel.findAll();
        }

        return res.render('pages/index', { postagens });
    } catch (error) {
        console.error('Erro ao listar postagens:', error);
        return res.render('pages/erro', {
            postagens: [],
            error: 'Erro ao listar postagens: ' + error.message,
        });
    }
}

//cria uma nova postagem
async function criarPostagem(req, res) {
    try {
        const { idUsuario } = req.session; //armazena a sessão do usuário
        const { titulo, conteudo, categoria } = req.body; //requere o título, conteúdo e categoria

        if (!idUsuario) return res.redirect('/login'); //verifica se está logado
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        await PostModel.create({
            titulo, conteudo, categoria, postUsuario: idUsuario
        });

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao criar postagem: ' + error.message,
        });
    }
}

//atualiza uma postagem existente (verifica a senha do usuário)
async function atualizarPostagem(req, res) {
    try {
        const { id } = req.params; //requere id dos parâmetros da URL
        const { senha, conteudo, categoria } = req.body; //requere a senha, o conteúdo e a categoria
        const { idUsuario } = req.session; //armazena a sessão do usuário

        if (!idUsuario) return res.redirect('/login'); //verifica se está logado
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        const postagem = await PostModel.findByPk(parseInt(id)); //busca o post pelo id
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para editá-la.',
            });
        }

        const usuario = await UsuarioModel.findByPk(idUsuario); //busca o usuário pelo id
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha); //compara as senhas
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta para editar a postagem.' });
        }

        await PostModel.update(
            { conteudo, categoria },
            { where: { idPost: parseInt(id) } }
        );

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao editar postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao editar postagem: ' + error.message,
        });
    }
}

//exclui uma postagem
async function excluirPostagem(req, res) {
    try {
        const { id } = req.params; //requere o id dos parâmetros
        const { idUsuario } = req.session; //armazena a sessão do usuário

        if (!idUsuario) return res.redirect('/login'); //pede para fazer login

        const postagem = await PostModel.findByPk(parseInt(id)); //busca por id
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para excluí-la.',
            });
        }

        await PostModel.destroy({ where: { idPost: parseInt(id) } }); //remove com a condição where

        return res.redirect(`/algo?usuarioId=${idUsuario}`);
    } catch (error) {
        console.error('Erro ao excluir postagem:', error);
        return res.render('pages/erro', {
            error: 'Erro ao excluir postagem: ' + error.message,
        });
    }
}

//página principal com todas as postagens
async function pagina(req, res) {
    try {
        const postagens = await PostModel.findAll(); //mostra todas as postagens
        return res.render('pages/index', { postagens });
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
        return res.render('pages/index', {
            postagens: [],
            error: 'Erro ao carregar postagens: ' + error.message,
        });
    }
}

module.exports = {
    listarPostagens,
    criarPostagem,
    atualizarPostagem,
    excluirPostagem,
    pagina,
};
