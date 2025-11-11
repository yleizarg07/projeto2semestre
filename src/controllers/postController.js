const postModel = require('../models/postModel');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs'); 

 //lista postagens, podendo filtrar por ID, usuário e categoria
function listarPostagens(req, res) {
    try {
        const { usuarioId, id, categoria } = req.query; 

        let postagens = [];
        if (id) {
            const postagem = postModel.buscarPorId(parseInt(id));
            if (!postagem) {
                //caso for uma busca por ID e não encontrar
                return res.render('pages/index', { error: 'Postagem não encontrada', postagens: [] });
            }
            postagens = [postagem];
        } else {
            // postModel que lista deve aceitar filtros (usuarioId e categoria)
            postagens = postModel.listar(usuarioId ? parseInt(usuarioId) : undefined, categoria); 
        }

        //retorna o resultado da busca
        res.render('pages/index', { postagens });
    } catch (error) {
        res.render('pages/erro', {
            postagens: [],
            error: 'Erro ao listar postagens: ' + error.message
        });
    }
}

//Cria uma nova postagem
function criarPostagem(req, res) {
    try {
        const { usuarioId } = req.session;
        const { conteudo, categoria } = req.body; 

        if (!usuarioId) {
            //redireciona para login se não estiver na sessão
            return res.redirect('/login'); 
        }

        if (!conteudo || conteudo.trim() === '') {
            //retorna um erro na página
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        //cria a postagem
        postModel.criar(conteudo, usuarioId, categoria); 
        
        //se deu certo: redireciona
        return res.redirect(`/algo?usuarioId=${usuarioId}`); 
        
    } catch (error) {
        //caso falhe
        res.render('pages/erro', {
            error: 'Erro ao criar postagem: ' + error.message
        });
    }
}

//atualiza uma postagem existente, exigindo a senha do usuário para verificação
function atualizarPostagem(req, res) {
    try {
        const { id } = req.params;
        const { senha, conteudo, categoria } = req.body; 
        const { usuarioId } = req.session;

        //validação inicial e de permissão
        if (!usuarioId) {
            return res.redirect('/login');
        }

        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }

        const postagem = postModel.buscarPorId(parseInt(id));
        if (!postagem || postagem.userId !== usuarioId) {
            return res.render('pages/erro', { error: 'Postagem não encontrada ou você não tem permissão para editá-la.' });
        }
        
        //validação da senha
        const usuario = usuarioModel.buscarPorId(usuarioId);
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }
        
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta para editar a postagem.' });
        }

        // atualização 
        postModel.atualizar(parseInt(id), conteudo, categoria);  
        
        //redireciona caso de certo
        return res.redirect(`/algo?usuarioId=${usuarioId}`);
        
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao editar postagem: ' + error.message
        });
    }
}

//exclui uma postagem
function excluirPostagem(req, res) {
        const { id } = req.params;
        const { usuarioId } = req.session;

        if (!usuarioId) {
            return res.redirect('/login');
        }

        const postagem = postModel.buscarPorId(parseInt(id));
        if (!postagem || postagem.userId !== usuarioId) {
            return res.render('pages/erro', { error: 'Postagem não encontrada ou você não tem permissão para excluí-la.' });
        }

        postModel.remover(parseInt(id));
        
        return res.redirect(`/algo?usuarioId=${usuarioId}`);
    }


//rota para carregar a página principal com todas as postagens
function pagina(req, res) {
    try {
        const postagens = postModel.listar(); 

        res.render('pages/index', { postagens });
    } catch (error) {
        res.render('pages/index', {
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