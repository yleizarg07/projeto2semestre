const comentarioModel = require('../models/comentarioModel');
const postModel = require('../models/postModel');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

//lista comentários,e pode filtrat por categoria ou ID da postagem
function listarComentarios(req, res) {
    try {
        //categria é um filtro ou que 'postId' é usado para listar
        const { categoria, postId } = req.query; 

        let comentarios;
        
        if (postId) {
            //lista comentários de uma postagem específica
            comentarios = comentarioModel.listarPorPostId(parseInt(postId));
        } else if (categoria) {
             //lista comentários por categoria (se o model suportar)
             comentarios = comentarioModel.listarPorCategoria(categoria);
        } else {
            //se não houver filtro, lista todos os comentários
            comentarios = comentarioModel.listar(); 
        }

        //apenas retorna o resultado da busca
        res.render('pages/comentarios', { comentarios });
    } catch (error) {
        res.render('pages/comentarios', {
            comentarios: [],
            error: 'Erro ao listar comentários: ' + error.message
        });
    }
}

//cria um novo comentário
function criarComentario(req, res) {
    try {
        const { usuarioId } = req.session; 
        const { postId, conteudo } = req.body; 

        if (!usuarioId) {
            return res.redirect('/login'); //usuário deve estar logado
        }

        if (!conteudo || conteudo.trim() === '' || !postId) {
            return res.render('pages/criarComentario', { error: 'Conteúdo do comentário e ID da Postagem são obrigatórios.' });
        }

        const postagem = postModel.buscarPorId(parseInt(postId)); 
        if (!postagem) {
            return res.render('pages/criarComentario', { error: 'Postagem não encontrada.' });
        }

        comentarioModel.criar(conteudo, usuarioId, parseInt(postId));

        //redireciona para a postagem de origem
        return res.redirect(`/postagem/${postId}`); 
        
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao criar comentário: ' + error.message
        });
    }
}


//atualiza um comentário existente e exige a senha do usuário
function atualizarComentario(req, res) {
    try {
        const { id } = req.params; 
        const { senha, conteudo } = req.body; 
        const { usuarioId } = req.session; 
        
        if (!usuarioId) {
            return res.redirect('/login');
        }

        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo é obrigatório.' });
        }

        const comentario = comentarioModel.buscarPorId(parseInt(id));
        
        // verifica a permissão e a existencia
        if (!comentario || comentario.userId !== usuarioId) {
            return res.render('pages/erro', { error: 'Comentário não encontrado ou você não tem permissão para editá-lo.' });
        }
        
        //validação da Senha
        const usuario = usuarioModel.buscarPorId(usuarioId);
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }
        
        const senhaValida = bcrypt.compareSync(senha, usuario.senha); 
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta.' });
        }

        // atualização 
        comentarioModel.atualizar(parseInt(id), conteudo);
        
        // redireciona para a postagem do comentário
        const postId = comentario.postId;
        return res.redirect(`/postagem/${postId}`); 
        
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao atualizar comentário: ' + error.message
        });
    }
}


//Exclui um comentário
function excluirComentario(req, res) {
    try {
        const { id } = req.params; 
        const { usuarioId } = req.session;
        
        if (!usuarioId) {
            return res.redirect('/login');
        }

        const comentario = comentarioModel.buscarPorId(parseInt(id));
        
        // verifica a permissão e a existencia
        if (!comentario || comentario.userId !== usuarioId) {
            return res.render('pages/erro', { error: 'Comentário não encontrado ou você não tem permissão para excluí-lo.' });
        }
        
        const postId = comentario.postId; // salva o ID da postagem antes de remover

        comentarioModel.remover(parseInt(id)); 
        
        // redireciona para a postagem de origem
        return res.redirect(`/postagem/${postId}`); 
        
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