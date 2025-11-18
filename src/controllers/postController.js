const Post = require('../models/postModel');
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

//lista as postagens e pode  filtrar por id, usuario e categoria
async function listarPostagens(req, res) {
    try {
        const { id, categoria } = req.query;//requisição da do id do usuari0, do id da postagem e da categoria
        let postagens;

        if (id) {
            const postagem = await Post.findByPk(parseInt(id));//procura o post pelo id
            if (!postagem) {
                return res.render('pages/index', {
                    error: 'Postagem não encontrada',
                });
            }//se o id for diferente aparece essa mensagem
        } else if (categoria) {
            postagens = await postagens.findAll({
                where: {categoria}
            });
        }
        else {
            postagens = await Post.findAll();
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
        const { idUsuario } = req.session; //armazena a sessão do usuario
        const { titulo, conteudo, categoria } = req.body;//requre o titulo, o conteudo e a categoria enviadas pelo usuario

        if (!idUsuario) return res.redirect('/login'); //verifica se ta logado
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }//verifica se tem conteudo da postagem

        await Post.create({
            titulo, conteudo, categoria, postUsuario: idUsuario
        });//cria a postegem 

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
        const { id } = req.params;//requre id dos parametros da url
        const { senha, conteudo, categoria } = req.body;//rewquere a msenha, o conteudo e a categoria enviadas pelo isuario
        const { idUsuario } = req.session;//aemazena a sessão do usuario

        if (!idUsuario) return res.redirect('/login');//verifica se ta logado
        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });
        }//verifica se foi preenchido os requisitos 

        const postagem = await Post.findByPk(parseInt(id));//busca o post pelo id
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para editá-la.'
            });
        }

        const usuario = await Usuario.findByPk(idUsuario);//busca o usuario pelo id do usuario
        if (!usuario) {
            return res.render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });
        }//verifica se o usuario existe com aqule id

        const senhaValida = await bcrypt.compare(senha, usuario.senha);//compara as senhas
        if (!senhaValida) {
            return res.render('pages/erro', { error: 'Senha incorreta para editar a postagem.' });
        }//mostra caso a senha for invalida

        await Post.update(
            { conteudo, categoria },
            { where: { idPost: parseInt(id) } }
        );//atualiza

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
        const { id } = req.params;//requere o id dos paramentros da url
        const { idUsuario } = req.session;//armazena a sessão do usuario

        if (!idUsuario) return res.redirect('/login');//manda fazer login 

        const postagem = await Post.findByPk(parseInt(id));//busca por id 
        if (!postagem || postagem.postUsuario !== idUsuario) {
            return res.render('pages/erro', {
                error: 'Postagem não encontrada ou você não tem permissão para excluí-la.'
            });
        }

        await Post.destroy({ where: { idPost: parseInt(id) } });//detroi com a condição where

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