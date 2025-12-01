const path = require('path');
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const PostModel = require('../models/postModel');
const ComentarioModel = require('../models/comentarioModel');

/*
 novamente os termos para eu não esqucer e ficar facil de visualizar ;)
 -try/catch: bloco para tratar exceções 
 -query: parâmetros da query string da URL 
 -params: parâmetros da rota 
 -body: corpo da requisição
 -session: sessão do usuário
 -findAll: busca todos os registros com filtro where 
 -findByPk: busca por Primary Key 
 -map: repte sobre array e aplica função a cada elemento
 -filter: filtra array mantendo apenas elementos que retornam verdadeiro
 -promise.all: aguarda múltiplas promises em paralelo
 -set: estrutura que armazena valores únicos
 -spread operator (...): expande um array ou umobjeto em elementos individuais
*/

async function listarPostagens(req, res) {
    try {
        //extrai parametros de filtro da query string
        const { id, categoria, usuario } = req.query; //filtros opcionais, então teoricamente dá para preencher apenas um
        
        //monta o objeto where, que é as condições do filtr para o banco de dados
        let where = {};
        if (categoria) where.categoria = categoria; //filtra por categoria se fornecido
        if (usuario) where.postUsuario = parseInt(usuario); //filtra por usuário se fornecido

        let postagens = [];
        if (id) {
            //se id foi fornecido ele busca apenas a postagem com esse id
            const p = await PostModel.findByPk(parseInt(id));
            if (!p) return res.status(404).render('pages/erro', { error: 'Postagem não encontrada.' });
            postagens = [p]; //coloca em array para manter a compatibilidade com código abaixo
        } else {
            //caso contrário busca todas as postagens que atendem aos filtros 
            postagens = await PostModel.findAll({ where });
        }

        //promise.all executa todas as buscas de usuário em paralelo 
        const postagensView = await Promise.all(postagens.map(async p => {
            let usuarioNome = null;
            let usuarioUsername = null;
            
            if (p.postUsuario) {
                //busca o usuário que criou essa postagem
                const u = await UsuarioModel.findByPk(p.postUsuario, { attributes: ['idUsuario', 'nome', 'nome_usuario'] });
                if (u) {
                    usuarioNome = u.nome;
                    usuarioUsername = u.nome_usuario;
                }
            }
            
            //retorna objeto com dados da postagem mais os dados do usuário. Aqui está o nome usuario Gi.
            return {
                idPost: p.idPost,
                titulo: p.titulo,
                conteudo: p.conteudo,
                categoria: p.categoria,
                postUsuario: p.postUsuario,
                usuarioNome, //nome do usuário que criou a postagem
                nomeUsuario: usuarioUsername //esse é o nickname
            };
        }));
        //pega todos os ids de usuários das postagen, remove duplicatas com Set, e converte de volta em array
        const usuariosIds = [...new Set(postagensView.map(p => p.postUsuario).filter(Boolean))];
        //busca cada um desses usuários
        const usuarios = await Promise.all(usuariosIds.map(idU => UsuarioModel.findByPk(idU, { attributes: ['idUsuario', 'nome', 'nome_usuario'] })));

        //renderiza a view index passando as postagens 
        return res.render('pages/index', { postagens: postagensView, usuarios: usuarios.filter(Boolean) });
    } catch (error) {
        //em caso de erro ele loga no servidor e renderiza página de erro
        console.error('Erro ao listar postagens:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao listar postagens: ' + error.message });
    }
}

async function criarPostagem(req, res) {
    try {
        //idUsuario é o identificador do usuário armazenado na sessão
        const { idUsuario } = req.session;
        //recebe título, conteúdo e categoria do formulário
        const { titulo, conteudo, categoria } = req.body;

        //valida se usuário está logado
        if (!idUsuario) return res.redirect('/usuarios/login');
        //valida se conteúdo foi preenchido 
        if (!conteudo || conteudo.trim() === '') return res.status(400).render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });

        //cria novo registro de postagem no banco e a categoria padrão é 'geral' se não for fornecida
        await PostModel.create({ titulo, conteudo, categoria: categoria || 'Geral', postUsuario: idUsuario });
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao criar postagem:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao criar postagem: ' + error.message });
    }
}

async function atualizarPostagem(req, res) {
    try {
        //identificador da postagem na rota 
        const { id } = req.params;
        //senha, conteudo, categoria campos enviados no formulário
        const { senha, conteudo, categoria } = req.body;
        //id do usuário armazenado na sessão
        const { idUsuario } = req.session;

        //valida se usuário está logado
        if (!idUsuario) return res.redirect('/usuarios/login');
        //valida se conteúdo foi preenchido
        if (!conteudo || conteudo.trim() === '') return res.status(400).render('pages/erro', { error: 'Conteúdo da postagem é obrigatório.' });

        //busca a postagem pelo id
        const postagem = await PostModel.findByPk(parseInt(id));
        //verifica se postagem existe e se o usuário logado é o dono 
        if (!postagem || postagem.postUsuario !== idUsuario) return res.status(403).render('pages/erro', { error: 'Postagem não encontrada ou sem permissão.' });

        //busca os dados completos do usuário 
        const usuario = await UsuarioModel.findByPk(idUsuario);
        if (!usuario) return res.status(401).render('pages/erro', { error: 'Erro de sessão. Usuário não encontrado.' });

        //compara a senha fornecida com a impressão digital armazenado no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).render('pages/erro', { error: 'Senha incorreta para editar a postagem.' });

        //atualiza a postagem no banco e usa categoria enviada ou mantém a categoria anterior se não for alterada
        await PostModel.update({ conteudo, categoria: categoria || postagem.categoria }, { where: { idPost: parseInt(id) } });
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao editar postagem:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao editar postagem: ' + error.message });
    }
}

async function excluirPostagem(req, res) {
    try {
        //identificador da postagem na rota
        const { id } = req.params;
        //id do usuário logado
        const { idUsuario } = req.session;
        
        if (!idUsuario) return res.redirect('/usuarios/login');

        //busca a postagem pelo id
        const postagem = await PostModel.findByPk(parseInt(id));
        //erifica se existe e se o usuário logado é o dono
        if (!postagem || postagem.postUsuario !== idUsuario) return res.status(403).render('pages/erro', { error: 'Postagem não encontrada ou sem permissão.' });

        //deleta a postagem do banco de dados
        await PostModel.destroy({ where: { idPost: parseInt(id) } });
        
        //redireciona para a listagem de posts
        return res.redirect('/posts');
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao excluir postagem:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao excluir postagem: ' + error.message });
    }
}

//página principal com todas as postagens 
async function pagina(req, res) {
    try {
        //reaproveita a função listarPostagens sem passar nenhum filtro e assim exibe todas as postagens com usuários
        return await listarPostagens(req, res);
    } catch (error) {
        //em caso de erro ele loga e renderiza página de erro
        console.error('Erro ao carregar postagens:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao carregar postagens: ' + error.message });
    }
}

async function exibirPost(req, res) {
    try {
        const { id } = req.params;

        const postagem = await PostModel.findByPk(parseInt(id));
        if (!postagem) {
            return res.status(404).render('pages/erro', { error: 'Postagem não encontrada.' });
        }

        const usuario = await UsuarioModel.findByPk(postagem.postUsuario);

        const comentarios = await ComentarioModel.findAll({
            where: { comentPost: parseInt(id) },
            order: [['idComentario', 'DESC']] });

        const comentariosView = await Promise.all(
            comentarios.map(async (c) => {
                const u = await UsuarioModel.findByPk(c.comentUsua, {
                    attributes: ['nome_usuario']
                });
                 return {
                    conteudo: c.conteudo,
                    nomeUsuario: u ? u.nome_usuario : 'Anônimo'
                };
            })
        );

        return res.render('pages/post', {
            postagem,
            usuario,
            comentarios: comentariosView
        });

    } catch (error) {
        console.error(error);
        return res.status(500).render('pages/erro', { error: 'Erro ao carregar postagem.' });
    }
}

module.exports = {
    listarPostagens,
    criarPostagem,
    atualizarPostagem,
    excluirPostagem,
    pagina,
    exibirPost
};
