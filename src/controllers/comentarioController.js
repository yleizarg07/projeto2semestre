const comentarioModel = require('./models/comentarioModel');
const postModel = require('./models/postModel');
const usuarioModel = require('./models/usuarioModel');
const bcrypt = require('bcryptjs');

//lista comentários e pode filtrar por categoria ou id do post
async function listarComentarios(req, res) { //async faz com que o a função não pare de executar o codigo
    try {
        const { categoria, idPost } = req.query; //requisição da categoria e do id do post
        let comentarios; //cria a variavel comentários
        
        if (idPost) {
            comentarios = await comentarioModel.findAll({
                where: { comentPost: parseInt(idPost) }
            });//findall retorna tuso (como o select *), where seleciona a linha com as condições dadas
        } else if (categoria) {
            comentarios = await comentarioModel.findAll({
                include: {
                    model: postModel,
                    where: { categoria: categoria },
                }
            }); //o include traz dados de tabelas relacionadas, como no join, busca usuario com seus posts
        } else {
            comentarios = await comentarioModel.findAll();
        }// se não ele só retorna tudo

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
        const { idUsuario } = req.session; //o req.session armazena os dados da sessão do usuario
        const { idPost, conteudo } = req.body; //requere os dados enviados do usuario na requisição put ou post, aqui as inforações do post

        if (!idUsuario) {
            return res.redirect('/login');
        }//se o id do usuario for diferente ele pede para logar

        if (!conteudo || conteudo.trim() === '' || !idPost) {
            return res.render('pages/criarComentario', {
                error: 'Conteúdo e ID da Postagem são obrigatórios.'
            });// verifica se os campos foram preenchidos
        }

        const postagem = await postModel.findByPk(parseInt(idPost));
        if (!postagem) {
            return res.render('pages/criarComentario', {
                error: 'Postagem não encontrada.'
            });
        }//findbypk busca o post pelo id

        await comentarioModel.create({
            conteudo: conteudo,
            comentPost: parseInt(idPost),
            comentUsua: idUsuario
        }); //cria o comentario e armazena no atributo

        return res.redirect(`/postagem/${idPost}`);//redireciona para a pagina com o id do post
    } catch (error) {
        res.render('pages/erro', {
            error: 'Erro ao criar comentário: ' + error.message
        });
    }
}

//atualiza comentário existente e exige senha do usuário
async function atualizarComentario(req, res) {
    try {
        const { id } = req.params;//requere os paramentrosenviados na url
        const { senha, conteudo } = req.body;//requere a senha e o conteudo enviados pelo usuario
        const { idUsuario } = req.session;//armazena od dados da sessão do usuario

        if (!idUsuario) {
            return res.redirect('/login');
        }//caso o id do usuario for diferente, pede para ele logar

        if (!conteudo || conteudo.trim() === '') {
            return res.render('pages/erro', { error: 'Conteúdo é obrigatório.' });
        }//verfica se o campo foi preenchido

        const comentario = await comentarioModel.findByPk(parseInt(id));//busca o comentario pelo id
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
