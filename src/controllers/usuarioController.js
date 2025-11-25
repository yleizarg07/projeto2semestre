const path = require('path');
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const PostModel = require('../models/postModel');

//lista todos os usuarios ou um usuario especifico por id
async function listarUsuarios(req, res) {
    try {
        const { nomeUsuario } = req.query; //requisita o nome de usuário
        var usuarios; //cria a variável usuarios

        if (nomeUsuario) {
            console.log("Nome de usuário fornecido:", nomeUsuario);
            const usuarioEncontrado = await UsuarioModel.findOne({ where: { nome_usuario: nomeUsuario } }); //busca o usuário pelo nome
            console.log("Usuário encontrado:", usuarioEncontrado);
            if (!usuarioEncontrado) {
                return res.render('pages/index', {usuarios: [],
                    postagens: [],
                    error: 'Usuário não encontrado'
                });
            }
            usuarios = [usuarioEncontrado]; //coloca o usuário encontrado dentro de um array
        } else {
            usuarios = await UsuarioModel.findAll(); //retorna todos os usuários
        }

        return res.render('pages/index', { usuarios:usuarios, postagens:[] }); //renderiza a página com a lista de usuários
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.render('pages/index', {
            usuarios: [],
            postagens: [],
            error: 'Erro ao listar usuários: ' + error.message
        });
    }
}


async function listarSocial(req, res) {
    try {
        const idUsuario = req.session.idUsuario; //requere o id do usuario logado
        if (!idUsuario) {
            return res.status(401).redirect('/usuarios/login');
        }// se não tiver logado pede login
        const usuario = await UsuarioModel.findOne({//busca um unico registro e seus atributos do bd
            where: { idUsuario },
            attributes: ['relacionamento', 'aniversario', 'idade', 'interesses', 'hobbies', 'estilo', 'animaisEstimacao', 'paixoes', 'humor'] 
        });

        if (!usuario) {
            return res.status(404).render('pages/index', { error: 'Usuário não encontrado' });
        }//caso não encontre o usuario

        return res.status(200).render('pages/perfil', { usuario });//redireciona para o perfil
    } catch (error) {
        console.error('Erro ao listar dados sociais:', error);
        return res.status(500).render('pages/perfil', {
            error: 'Erro ao listar dados sociais: ' + error.message
        });//trata o erro
    }
}


//cria um novo usuario
async function criarUsuario(req, res) {
    try {
        const { nome, email, nomeUsuario, senha } = req.body;//requere os envios do usuario

        const hashedSenha = await bcrypt.hash(senha, 10);//poem a impressão digital na senha

        await UsuarioModel.create({
            nome: nome,
            nome_usuario: nomeUsuario,
            email: email,
            senha: hashedSenha,
            quanti_post: 0
        });//cria o usuario

        return res.status(201).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).render('pages/usuarios', {
            error: 'Erro ao criar usuário: ' + error.message
        });
    }
}

//cria os dados sociais de um usuário
async function criarSocial(req, res) {
    try {
        const {
            relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor
        } = req.body;//reqwuere as informações enviadas pelo usuario

        await UsuarioModel.create({
            relacionamento: relacionamento,
            aniversario: aniversario,
            idade: idade,
            interesses: interesses,
            hobbies: hobbies,
            estilo: estilo,
            animaisEstimacao: animaisEstimacao,
            paixoes: paixoes,
            humor: humor
        });//armazena as informações na tabela do usuario

        return res.status(201).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao criar social do usuário:', error);
        return res.status(500).render('pages/perfil', {
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
        } = req.body;//requere as infos enviadas pelo usuaerio

        const dadosSociais = {
            relacionamento, aniversario, idade, interesses, hobbies, estilo, animaisEstimacao, paixoes, humor
        };//armazena nan variavel dadossociais

        // remove campos indefinidos
        Object.keys(dadosSociais).forEach(
            key => dadosSociais[key] === undefined && delete dadosSociais[key]
        );//foreach percorre o array dadossociais, object.keys retorna um array com todas as propriedades, essa parte serve para remover as propriedades indefinidas

        const [atualizados] = await UsuarioModel.update(dadosSociais, {
            where: { idUsuario: parseInt(id) }
        });// o const [atualizados] serve para extrair os valores da array 
        if (!atualizados) {
            const todosUsuarios = await UsuarioModel.findAll();//mostra tudo
            return res.render('pages/algo', {
                usuarios: todosUsuarios,
                error: 'Usuário não encontrado'
            });
        }

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        const todosUsuarios = await UsuarioModel.findAll();
        return res.status(500).render('pages/algo', {
            usuarios: todosUsuarios,
            error: 'Erro ao atualizar informações sociais: ' + error.message
        });
    }
}

//realiza o login do usuário
async function login(req, res) {
    try {
        const { email, senha } = req.body;//requere o email e a senha enviados pelo usuario

        const usuarioEncontrado = await UsuarioModel.findOne({ where: { email } });//findOne busca um unico registro no bd
        if (!usuarioEncontrado) {
            return res.status(404).render('pages/login', { error: 'Usuário não encontrado, faça seu cadastro' });
        }

        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);//compara as senhas
        if (!senhaValida) {
            return res.status(401).render('pages/login', { error: 'Senha incorreta' });
        }

        req.session.idUsuario = usuarioEncontrado.idUsuario;

        return res.status(200).redirect('/usuarios');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).render('pages/login', {
            error: 'Erro ao fazer login: ' + error.message
        });
    }
}

//atualiza os dados principais do usuário, como nome, nomeUsuario, senha
async function atualizarUsuario(req, res) {
    try {
        const { id } = req.params;//reqyer os parametro da url
        const { nome, nomeUsuario, senha } = req.body;//requere os dados enviados pelo usuario

        let dadosAtualizados = { nome, nome_usuario: nomeUsuario };//recebe os dados que serão atualizados

        if (senha) {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }//coloca a impressão digital na senha

        const [atualizados] = await UsuarioModel.update(dadosAtualizados, {
            where: { idUsuario: parseInt(id) }
        });

        if (!atualizados) {
            const todosUsuarios = await UsuarioModel.findAll();//mostra tudo
            return res.render('pages/algo', {
                usuarios: todosUsuarios,
                error: 'Usuário não encontrado'
            });
        }
        return res.status(200).redirect('/algo');
    } catch (error) {
        const todosUsuarios = await UsuarioModel.findAll();
        return res.status(500).render('pages/algo', {
            usuarios: todosUsuarios,
            error: 'Erro ao atualizar usuário: ' + error.message
        });
    }
}

//remove um usuário 
async function removerUsuario(req, res) {
    try {
        const { id } = req.params;//requere os parametros da url
        const idUsuario = parseInt(id);//armazena o id na variavel usuario

        const removidos = await UsuarioModel.destroy({ where: { idUsuario: idUsuario } });//destroi

        if (!removidos) {
            const todosUsuarios = await UsuarioModel.findAll();//mostra tudo
            return res.status(404).render('pages/algo', {
                usuarios: todosUsuarios,
                error: 'Usuário não encontrado'
            });
        }

        return res.status(200).redirect('/');
    } catch (error) {
        const todosUsuarios = await UsuarioModel.findAll();//mostra tudo
        return res.status(500).render('pages/index', {
            usuarios: todosUsuarios,
            error: 'Erro ao remover usuário: ' + error.message
        });
    }
}

//carrega página inicial
async function paginaUsuario(req, res) {
    try {
        const usuarios = await UsuarioModel.findAll();//mostra tudo
        return res.render('pages/index', { usuarios:usuarios, postagens:[] });
    } catch (error) {
        return res.render('pages/index', {
            usuarios: [],
            postagens: [],
            error: 'Erro ao carregar a página: ' + error.message
        });
    }
}

// renderiza a página de login 
function mostraLogin(req, res) {
    return res.status(200).render('pages/login');
}

module.exports = {
    listarUsuarios,
    criarUsuario,
    criarSocial,
    atualizarSocial,
    atualizarUsuario,
    removerUsuario,
    login,
    pagina: paginaUsuario,
    mostraLogin
};
