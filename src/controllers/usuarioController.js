const path = require('path');
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const PostModel = require('../models/postModel');

/*
 oq alguns termos são, para eu não esqucer
 -async: assíncrono 
 -await: aguarda o resultado de uma Promise
 -try/catch: bloco para tatar ede excessões
 -query: parametros da query string da URL
 -params: parâmetros da rota
 -body: corpo da requisição
 -session: sessão do usuário 
 -findAll: método do sequelize para buscar todos os registros
 -findOne/findByPk: busca um registro 
 -update: atualiza registros no banco
 -destroy: remove registros do banco
 -render: renderiza uma view com dados
 -redirect: redireciona o navegador para outra URL
*/

//lista todos os usuarios id 
async function listarUsuarios(req, res) {
    try {
        //extrai o parâmetro nomeUsuario da query string 
        const { nomeUsuario } = req.query; //requere o nome de usuário
        var usuarios; //variável que irá conter a lista de usuários

        if (nomeUsuario) {
            //se foi fornecido um nome de usuário na query, busca apenas esse usuário
            //UsuarioModel.findOne: busca um único registro onde nome_usuario é igual a nomeUsuario
            const usuarioEncontrado = await UsuarioModel.findOne({ where: { nome_usuario: nomeUsuario } }); //busca o usuário pelo nickname
            if (!usuarioEncontrado) {
                //se não encontrou ele renderiza a página de usuários com mensagem de erro
                return res.render('pages/usuarios', { usuarios: [], error: 'Usuário não encontrado' });
            }
            //coloca o usuário encontrado dentro de um array para manter interface consistente com findAll
            usuarios = [usuarioEncontrado]; //aqui coloca o usuário encontrado dentro de um array
        } else {
            //se não foi fornecido filtro ele busca todos os usuários 
            usuarios = await UsuarioModel.findAll({ attributes: ['idUsuario', 'nome', 'nome_usuario'] }); //retorna todos os usuários
        }

        //renderiza a view de listagem de usuários passando o array 'usuarios'
        return res.render('pages/usuarios', { usuarios }); //renderiza a página com a lista de usuários
    } catch (error) {
        //se ocorrer qualquer erro dentro do try ele vem pra cá cai aqui
        console.error('Erro ao listar usuários:', error);
        return res.status(500).render('pages/usuarios', {
            usuarios: [],
            error: 'Erro ao listar usuários: ' + error.message
        });
    }
}

async function listarSocial(req, res) {
    try {
        //idUsuario é o identificador do usuário armazenado na sessão
        const idUsuario = req.session.idUsuario; //requere o id do usuario logado
        if (!idUsuario) {
            //se não há id na sessão o usuário precisa fazer login
            return res.status(401).redirect('/usuarios/login');
        }

        //busca o registro do usuário pelo id 
        const usuario = await UsuarioModel.findOne({
            where: { idUsuario },
            //attributes = lista dos campos que queremos retornar do banco
            attributes: ['relacionamento', 'aniversario', 'idade', 'interesses', 'hobbies', 'estilo', 'animaisEstimacao', 'paixoes', 'humor']
        });

        if (!usuario) {
            return res.status(404).render('pages/erro', { error: 'Usuário não encontrado' });
        }

        //renderiza a página que mostra os dados sociais do usuário
        return res.status(200).render('pages/socialUsuario', { usuario });
    } catch (error) {
        //erro no servidor e render de página de erro
        console.error('Erro ao listar dados sociais:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao listar dados sociais: ' + error.message });
    }
}

async function criarUsuario(req, res) {
    try {
        //são campos enviados pelo formulário:
        const { nome, email, nomeUsuario, senha } = req.body; //requere os envios do usuario

        // incluir um novo campo repetir senha
        // comparar senha == repetirsenha
        // se for diferente, alerta, foco no campo senha
        // se for igual, criptografa ou salva apenas a senha


        //hashedSenha é aversão criptografada da senha, a impressão digital
        const hashedSenha = await bcrypt.hash(senha, 10); //põe a impressão digital na senha

        //cria o usuário no banco
        await UsuarioModel.create({
            nome: nome,
            nome_usuario: nomeUsuario,
            email: email,
            senha: hashedSenha,
            quanti_post: 0
        }); 
        //redireciona para a lista de usuários
        return res.status(201).redirect('/usuarios/login');
    } catch (error) {
        //em caso de erro ele loga no servidor e renderiza a view de usuários com mensagem
        console.error('Erro ao criar usuário:', error);
        return res.status(500).render('pages/cadastro', {
            error: 'Erro ao criar usuário: ' + error.message
        });
    }
}


async function criarSocial(req, res) {
    try {
        //campos do social enviados no body
        const { relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor } = req.body; //requere as informações enviadas pelo usuario

        //pega id do usuário da sessão
        const idUsuario = req.session.idUsuario;
        if (!idUsuario) return res.status(401).redirect('/usuarios/login');

        //monta objeto com os campos que irão ser atualizados
        const dados = { relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor };
        //remove campos que não foram preenchidos 
        Object.keys(dados).forEach(k => dados[k] === undefined && delete dados[k]);

        //faz update no banco e verifica quantos registros foram afetados
        const [atualizados] = await UsuarioModel.update(dados, { where: { idUsuario } });
        if (!atualizados) return res.status(404).render('pages/erro', { error: 'Usuário não encontrado' });

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao criar social do usuário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao criar social do usuário: ' + error.message });
    }
}

async function atualizarSocial(req, res) {
    try {
        const { id } = req.params; //id vindo na rota
        const { relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor } = req.body; //dados do formulário

        const dadosSociais = { relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor };
        //remove os campos indefinidos
        Object.keys(dadosSociais).forEach(key => dadosSociais[key] === undefined && delete dadosSociais[key]);

        //ao chamar o update ele retorna a quantidade de linhas atualizadas
        const [atualizados] = await UsuarioModel.update(dadosSociais, { where: { idUsuario: parseInt(id) } });
        if (!atualizados) {
            //se nada foi atualizado ele retorna o erro 404
            return res.status(404).render('pages/erro', { error: 'Usuário não encontrado' });
        }

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao atualizar informações sociais:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao atualizar informações sociais: ' + error.message });
    }
}

async function login(req, res) {
    try {
        //campos do formulário de login
        const { email, senha } = req.body; //requere o email e a senha enviados pelo usuario
        
        const hashedSenha = senha; //aqui a senha já vem criptografada do front-end

        // busca usuário por email
        const usuarioEncontrado = await UsuarioModel.findOne({ where: { email } }); //findOne busca um unico registro no bd
        if (!usuarioEncontrado) {
            //404 é que o usuário não existe
            return res.status(404).render('pages/login', { error: 'Usuário não encontrado, faça seu cadastro' });
        }

        //compara senha enviada com o hash armazenado
        const senhaValida = await bcrypt.compare(hashedSenha, usuarioEncontrado.senha); //compara as senhas
        if (!senhaValida) {
            return res.status(401).render('pages/login', { error: 'Senha incorreta' });
        }

        //grava id do usuário na sessão para autenticação em requisições futuras
        req.session.idUsuario = usuarioEncontrado.idUsuario;

        //redireciona para página de posts ao logar com sucesso
        return res.status(200).redirect('/posts');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).render('pages/login', {
            error: 'Erro ao fazer login: ' + error.message
        });
    }
}

async function logout(req, res) {
    try {
        // destrói a sessão do usuário
        req.session.destroy();    
        // redireciona para a página de principal 
        return res.status(200).redirect('/');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao fazer logout: ' + error.message 
        });
    }
}

async function atualizarUsuario(req, res) {
    try {
        const { id } = req.params; //id do usuário na rota
        const { nome, nomeUsuario, senha } = req.body; //dados do formulário

        const dadosAtualizados = { nome, nome_usuario: nomeUsuario };
        if (senha) dadosAtualizados.senha = await bcrypt.hash(senha, 10); //impressão digital da nova senha se fornecida

        const [atualizados] = await UsuarioModel.update(dadosAtualizados, { where: { idUsuario: parseInt(id) } });
        if (!atualizados) return res.status(404).render('pages/erro', { error: 'Usuário não encontrado' });

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao atualizar usuário: ' + error.message });
    }
}

async function removerUsuario(req, res) {
    try {
        const { id } = req.params; //id do usuário a ser removido
        const idUsuario = parseInt(id);//converte para inteiro

        const removidos = await UsuarioModel.destroy({ where: { idUsuario } }); //destroi registros com essa condição

        if (!removidos) {
            return res.status(404).render('pages/erro', { error: 'Usuário não encontrado' });
        }

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao remover usuário: ' + error.message });
    }
}


// carrega página inicial da listagem de usuários
async function paginaUsuario(req, res) {
    try {
        const usuarios = await UsuarioModel.findAll({ attributes: ['idUsuario', 'nome', 'nome_usuario'] });
        return res.render('pages/usuarios', { usuarios });
    } catch (error) {
        console.error('Erro ao carregar a página de usuários:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao carregar a página: ' + error.message });
    }
}

//renderiza a página de login 
function mostraLogin(req, res) {
    return res.status(200).render('pages/login', { error: null });
}

function mostraCadastro(req, res) {
    return res.status(200).render('pages/cadastro', { error: null });
}

async function buscarUsuarios(req, res) {
    try {
        const { nome } = req.query;
        if (!nome || nome.trim() === "") {
            return res.render('pages/buscaUsuarios', { usuarios: [], nome, error: "Digite um nome para buscar." });
        }
        const { Op } = require('sequelize');
        const usuarios = await UsuarioModel.findAll({
            where: {
                nome_usuario: {
                    [Op.like]: `%${nome}%`
                }
            },
            attributes: ['idUsuario', 'nome', 'nome_usuario']
        });
        return res.render('pages/buscaUsuarios', { usuarios, nome, error: null });
    } catch (error) {
        console.error("Erro na busca:", error);
        return res.status(500).render('pages/buscaUsuarios', { usuarios: [], nome: "", error: "Erro ao buscar usuários." });
    }
}


function mostrarSocial(req, res) {
    return res.status(200).render('pages/socialUsuario', { error: null });
}

async function mostraEditarUsuario(req, res) {
    try {
        const idUsuario = req.session.idUsuario;
        if (!idUsuario) return res.redirect('/usuarios/login');

        const usuario = await UsuarioModel.findOne({
            where: { idUsuario },
            attributes: ['idUsuario', 'nome', 'nome_usuario']
        });

        return res.render('pages/editarUsuario', { usuario });
    } catch (error) {
        console.error('Erro ao carregar edição de usuário:', error);
        return res.status(500).render('pages/erro', { error: 'Erro ao carregar edição' });
    }
}


module.exports = {
    listarUsuarios,
    criarUsuario,
    criarSocial,
    atualizarSocial,
    atualizarUsuario,
    removerUsuario,
    listarSocial,
    login,
    pagina: paginaUsuario,
    mostraLogin,
    mostraCadastro,
    buscarUsuarios,
    mostrarSocial,
    logout,
    mostraEditarUsuario
};
