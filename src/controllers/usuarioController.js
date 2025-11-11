const path = require('path');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const postModel = require('../models/postModel'); 

//Lista todos os usuários ou um usuário específico por ID
function listarUsuarios(req, res) {
    try {
        const { id } = req.query;

        let usuarios;
        if (id) {
            //garante que a busca por ID seja feita corretamente 
            const usuario = usuarioModel.buscarPorId(parseInt(id));
            usuarios = usuario ? [usuario] : [];
        } else {
            usuarios = usuarioModel.listar();
        }
        
        //renderiza a página com a lista de usuários
        res.render('pages/algo', { usuarios });
    } catch (error) {
        //trata o erro 
        res.render('pages/algo', { 
            usuarios: [], 
            error: 'Erro ao listar usuários: ' + error.message 
        });
    }
}

//Cria um novo usuário
async function criarUsuario(req, res) {
    try{
        const { nome, email, nomeUsuario, senha } = req.body;
        //uma "impressão digital" da senha
        const hashedSenha = bcrypt.hash(senha, 10);
        //cria o usuário 
        await Usuario.create({
            nome: nome,
            nome_usuario: nomeUsuario,
            email: email,
            senha: hashedSenha,
            quati_post: 0
        });
        //redireciona se sucesso
        return res.redirect('/');
    } catch (error) {
        // trata o erro
        console.error('Erro ao criar usuario:', error);
        return res.status(500).render('pages/algo', {
            error: 'Erro ao criar usuário:' + error.message});
    }
}

async function criarSocial(req, res) {
    try{
        const { relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor } = req.body;
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
        console.error('Erro ao criar social do usuario:', error);
        return res.status(500).render('pages/algo', {
            error: 'Erro ao criar social do usuario:' + error.message});
        }
    }
//Atualiza informações sociais do usuário
function atualizarSocial(req, res) {
    try {
        const { id } = req.params;
        const {
            relacionamento,
            aniversario,
            idade,
            interesses,
            hobbies,
            estilo,
            animaisEstimacao,
            paixoes,
            humor
        } = req.body;

        const dadosSociais = {
            relacionamento,
            aniversario,
            idade,
            interesses,
            hobbies,
            estilo,
            animaisEstimacao,
            paixoes,
            humor
        };

        //rmove os campos indefinidos, que não foram fornecidos no formulário
        Object.keys(dadosSociais).forEach(
            (key) => dadosSociais[key] === undefined && delete dadosSociais[key]
        );

        const usuarioAtualizado = usuarioModel.atualizarSociais(parseInt(id), dadosSociais);

        if (!usuarioAtualizado) {
            const usuarios = usuarioModel.listar();
            return res.render('pages/algo', {
                usuarios,
                error: 'Usuário não encontrado'
            });
        }

        return res.redirect('/algo');
    } catch (error) {
        const usuarios = usuarioModel.listar();
        res.render('pages/algo', {
            usuarios,
            error: 'Erro ao atualizar informações sociais: ' + error.message
        });
    }
}

//realiza o login do usuário
function login(req, res) {
    try {
        const { email, senha } = req.body;
        
        //busca o usuário pelo e-mail
        const usuario = usuarioModel.buscarPorEmail(email);
        if (!usuario) {
            return res.render('pages/login', { error: 'Usuário não encontrado' });
        }

        //compara a senha fornecida com a "impressão digital" armazenada
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
            return res.render('pages/login', { error: 'Senha incorreta' });
        }

        //define a sessão do usuário
        req.session.usuarioId = usuario.id; 
        
        //redireciona para a página do usuário
        return res.redirect('/algo'); 
    } catch (error) {
        res.render('pages/login', { 
            error: 'Erro ao fazer login: ' + error.message 
        });
    }
}

//atualiza os dados principais do usuário (nome, nomeUsuario, senha)
function atualizarUsuario(req, res) {
    try {
        const { id } = req.params;
        let { nome, nomeUsuario, senha } = req.body; 

        // Se uma nova senha for fornecida, faz a "imprssão digital"
        let hashedSenha = senha; //usa a senha se não for alterada
        if (senha) {
            hashedSenha = bcrypt.hashSync(senha, 10);
        }

        const usuarioAtualizado = usuarioModel.atualizar(
            parseInt(id), 
            nome, 
            nomeUsuario, 
            hashedSenha //passa a senha com a "impressão digitaç", se alterada
        );
        
        if (!usuarioAtualizado) {
            const usuarios = usuarioModel.listar();
            return res.render('pages/algo', { 
                usuarios, 
                error: 'Usuário não encontrado' 
            });
        }
        return res.redirect('/algo');
    } catch (error) {
        //trata dos erros 
        const usuarios = usuarioModel.listar();
        res.render('pages/algo', { 
            usuarios, 
            error: 'Erro ao atualizar usuário: ' + error.message 
        });
    }
}

//remove um usuário e suas postagens
function removerUsuario(req, res) {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        
        const usuarioRemovido = usuarioModel.remover(userId);
        
        if (!usuarioRemovido) {
            const usuarios = usuarioModel.listar();
            return res.render('pages/algo', { 
                usuarios, 
                error: 'Usuário não encontrado' 
            });
        }
        
        return res.redirect('/algo');
    } catch (error) {
        const usuarios = usuarioModel.listar();
        res.render('pages/algo', { 
            usuarios, 
            error: 'Erro ao remover usuário: ' + error.message 
        });
    }
}

//carrega a página
function pagina(req, res) {
    try {
        const usuarios = usuarioModel.listar();
        res.render('pages/algo', { usuarios });
    } catch (error) {
        res.render('pages/algo', { 
            usuarios: [], 
            error: 'Erro ao carregar a pagina: ' + error.message 
        });
    }
}

module.exports = {
    listarUsuarios,
    criarUsuario,
    criarSocial,
    removerUsuario,
    atualizarUsuario,
    atualizarSocial, 
    login, 
    pagina
}