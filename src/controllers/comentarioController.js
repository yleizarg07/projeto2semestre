const comentarioModel = require('../models/comentarioModel');
const postModel = require('../models/postModel');
const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

/*
  dnv os termos para eu não esquecer e ficar facil de visualizar :o
 -try e catch: bloco para tratar exceções 
 -query: parâmetros da query string da URL
 -params: parâmetros da rota
 -body: corpo da requisição
 -findAll: busca todos os registros com filtro where 
 -findByPk: busca por Primary Key
 -map: repete sobre array e aplica função a cada elemento
 -filter: filtra array mantendo apenas elementos que retornam verdadeiro
 -promise.all: aguarda múltiplas Promises em paralelo
*/

async function listarComentarios(req, res) {
    try {
        //extrai os parametros de filtro da query string
        const { categoria, idPost } = req.query;

        //monta objeto where para o bd
        if (idPost) where.comentPost = parseInt(idPost); //filtra comentários de um post específico

        //busca todos os comentários que atendem aos filtros
        const comentarios = await comentarioModel.findAll({ where });

        //comentário com dados de post e usuário e promise.all executa todas as buscas em paralelo
        const comentariosView = (await Promise.all(comentarios.map(async c => {
            //busca o post associado ao comentário
            const post = await postModel.findByPk(c.comentPost, { attributes: ['idPost', 'titulo', 'categoria', 'postUsuario'] });
            //se um filtro de categoria foi passado ele filtra manualmente
            if (categoria && post && post.categoria !== categoria) return null;
            //busca o usuário que criou o comentário
            const usuarioComentario = await UsuarioModel.findByPk(c.comentUsua, { attributes: ['idUsuario', 'nome', 'nome_usuario'] });
            //inicializa nome do usuário do post como null
            let postUsuarioNome = null;
            //se existe um post ele busca o nome do usuário que criou o post
            if (post && post.postUsuario) {
                const postUser = await UsuarioModel.findByPk(post.postUsuario, { attributes: ['nome'] });
                postUsuarioNome = postUser ? postUser.nome : null;
            }
            //etorna objeto com todos os dados necessários
            return {
                idComentario: c.idComentario,
                conteudo: c.conteudo,
                comentPost: c.comentPost,
                postTitulo: post ? post.titulo : null, //título da postagem
                postCategoria: post ? post.categoria : null, //categoria da postagem
                postUsuarioId: post ? post.postUsuario : null, //id do dono da postagem
                postUsuarioNome, //nome do dono da postagem
                usuarioComentarioNome: usuarioComentario ? usuarioComentario.nome : null, //nome de quem comentou
            };
        }))).filter(Boolean); //remove null, comentários que não passaram no filtro

        //renderiza a view
        return res.status(200).render('pages/comentarios', { comentarios: comentariosView });
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao listar comentários:', error);
        return res.status(500).render('pages/comentarios', { comentarios: [], error: 'Erro ao listar comentários: ' + error.message });
    }
}

async function criarComentario(req, res) {
    try {
        //identificador do usuário armazenado na sessão
        const { idUsuario } = req.session;
        //o idPost é o identificador da postagem a comentar e o conteudo é texto do comentário
        const { idPost, conteudo } = req.body;

        //valida se usuário está logado
        if (!idUsuario) return res.redirect('/usuarios/login');
        
        //valida se conteúdo foi preenchido e se idPost foi fornecido
        if (!conteudo || conteudo.trim() === '' || !idPost) return res.status(400).render('pages/criarComentario', { error: 'Conteúdo e ID da Postagem são obrigatórios.', idPost });

        // busca a postagem para verificar se existe
        const postagem = await postModel.findByPk(parseInt(idPost));
        if (!postagem) return res.status(404).render('pages/criarComentario', { error: 'Postagem não encontrada.', idPost });

        //cria novo comentário no bd
        await comentarioModel.create({ conteudo: conteudo, comentPost: parseInt(idPost), comentUsua: idUsuario });
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao criar comentário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao criar comentário: ' + error.message });
    }
}

async function atualizarComentario(req, res) {
    try {
        //identificador do comentário na rota 
        const { id } = req.params;
        const { senha, conteudo } = req.body;
        const { idUsuario } = req.session;

        //valida se usuário está logado
        if (!idUsuario) return res.redirect('/usuarios/login');
        //valida se conteúdo foi preenchido
        if (!conteudo || conteudo.trim() === '') return res.status(400).render('pages/erro', { error: 'Conteúdo é obrigatório.' });

        //busca o comentário pelo id
        const comentario = await comentarioModel.findByPk(parseInt(id));
        //verifica se existe e se o usuário logado é o dono 
        if (!comentario || comentario.comentUsua !== idUsuario) return res.status(403).render('pages/erro', { error: 'Comentário não encontrado ou sem permissão.' });

        //busca os dados completos do usuário 
        const usuario = await UsuarioModel.findByPk(idUsuario);
        if (!usuario) return res.status(401).render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });

        //compara a senha fornecida com a impressão digital armazenado no bd
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).render('pages/erro', { error: 'Senha incorreta.' });

        //atualiza o comentário no banco 
        await comentario.update({ conteudo: conteudo });
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao atualizar comentário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao atualizar comentário: ' + error.message });
    }
}

async function excluirComentario(req, res) {
    try {
        //identificador do comentário na rota
        const { id } = req.params;
        //id do usuário logado
        const { idUsuario } = req.session;
        
        if (!idUsuario) return res.redirect('/usuarios/login');

        //busca o comentário pelo id
        const comentario = await comentarioModel.findByPk(parseInt(id));
        //verifica se existe e se o usuário logado é o dono
        if (!comentario || comentario.comentUsua !== idUsuario) return res.status(403).render('pages/erro', { error: 'Comentário não encontrado ou sem permissão.' });

        //deleta o comentário do bd
        await comentario.destroy();
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao excluir comentário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao excluir comentário: ' + error.message });
    }
}

module.exports = {
    listarComentarios,
    criarComentario,
    atualizarComentario,
    excluirComentario
};
