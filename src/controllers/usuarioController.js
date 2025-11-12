const path = require('path');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');
const Post = require('../models/postModel');

//lista todos os usuarios ou um usuario especifico por id
async function listarUsuarios(req, res) {
    try {
        const { id } = req.query;
        let usuarios;

        if (id) {
            const usuario = await Usuario.findByPk(parseInt(id));
            usuarios = usuario ? [usuario] : [];
        } else {
            usuarios = await Usuario.findAll();
        }

        return res.render('pages/algo', { usuarios });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.render('pages/algo', {
            usuarios: [],
            error: 'Erro ao listar usuários: ' + error.message
        });
    }
}

//cria um novo usuario
async function criarUsuario(req, res) {
    try {
        const { nome, email, nomeUsuario, senha } = req.body;

        const hashedSenha = await bcrypt.hash(senha, 10);

        await Usuario.create({
            nome: nome,
            nome_usuario: nomeUsuario,
            email: email,
            senha: hashedSenha,
            quanti_post: 0
        });

        return res.redirect('/');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).render('pages/algo', {
            error: 'Erro ao criar usuário: ' + error.message
        });
    }
}

//cria os dados sociais de um usuário
async function criarSocial(req, res) {
    try {
        const {
            relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor
        } = req.body;

        await Usuario.create({
            relacionamento: relacionamento,
            aniversario: aniversario,
            idade: idade,
            interesses: interesses,
            hobbies: hobbies,
            estilo: estilo,
            animaisEstimacao: animaisEstimacao,
            paixoes: paixoes,
            humor: humor
        });

        return res.redirect('/');
    } catch (error) {
        console.error('Erro ao criar social do usuário:', error);
        return res.status(500).render('pages/algo', {
            error: 'Erro ao criar social do usuário: ' + error.message
        });
    }
}

//atualiza informações sociais do usuário
async function atualizarSocial(req, res) {
    try {
        const { id } = req.params;
        const {
            relacionamento, aniversario, idade, interesses,hobbies, estilo, animaisEstimacao, paixoes, humor
        } = req.body;

        const dadosSociais = {
            relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor
        };

        // remove campos indefinidos
        Object.keys(dadosSociais).forEach(
            key => dadosSociais[key] === undefined && delete dadosSociais[key]
        );

        const [atualizados] = await Usuario.update(dadosSociais, {
            where: { idUsuario: parseInt(id) }
        });

        if (!atualizados) {
            const usuarios = await Usuario.findAll();
            return res.render('pages/algo', {
                usuarios,
                error: 'Usuário não encontrado'
            });
        }

        return res.redirect('/algo');
    } catch (error) {
        const usuarios = await Usuario.findAll();
        return res.render('pages/algo', {
            usuarios,
            error: 'Erro ao atualizar informações sociais: ' + error.message
        });
    }
}

//realiza o login do usuário
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.render('pages/login', { error: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.render('pages/login', { error: 'Senha incorreta' });
        }

        req.session.idUsuario = usuario.idUsuario;

        return res.redirect('/algo');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.render('pages/login', {
            error: 'Erro ao fazer login: ' + error.message
        });
    }
}

//atualiza os dados principais do usuário, como nome, nomeUsuario, senha
async function atualizarUsuario(req, res) {
    try {
        const { id } = req.params;
        const { nome, nomeUsuario, senha } = req.body;

        let dadosAtualizados = { nome, nome_usuario: nomeUsuario };

        if (senha) {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        const [atualizados] = await Usuario.update(dadosAtualizados, {
            where: { idUsuario: parseInt(id) }
        });

        if (!atualizados) {
            const usuarios = await Usuario.findAll();
            return res.render('pages/algo', {
                usuarios,
                error: 'Usuário não encontrado'
            });
        }
        return res.redirect('/algo');
    } catch (error) {
        const usuarios = await Usuario.findAll();
        return res.render('pages/algo', {
            usuarios,
            error: 'Erro ao atualizar usuário: ' + error.message
        });
    }
}

//remove um usuário 
async function removerUsuario(req, res) {
    try {
        const { id } = req.params;
        const idUsuario = parseInt(id);

        const removidos = await Usuario.destroy({ where: { idUsuario: idUsuario } });

        if (!removidos) {
            const usuarios = await Usuario.findAll();
            return res.render('pages/algo', {
                usuarios,
                error: 'Usuário não encontrado'
            });
        }

        return res.redirect('/algo');
    } catch (error) {
        const usuarios = await Usuario.findAll();
        return res.render('pages/algo', {
            usuarios,
            error: 'Erro ao remover usuário: ' + error.message
        });
    }
}

//carrega página inicial
async function pagina(req, res) {
    try {
        const usuarios = await Usuario.findAll();
        return res.render('pages/algo', { usuarios });
    } catch (error) {
        return res.render('pages/algo', {
            usuarios: [],
            error: 'Erro ao carregar a página: ' + error.message
        });
    }
}

module.exports = {
    listarUsuarios,
    criarUsuario,
    criarSocial,
    atualizarSocial,
    atualizarUsuario,
    removerUsuario,
    login,
    pagina
};