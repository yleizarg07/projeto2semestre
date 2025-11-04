const path = require('path');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

function listarUsuarios(req, res) {
  try {
    const { id } = req.query;

    let usuarios;
    if (id) {
      const usuario = usuarioModel.buscarPorId(parseInt(id));
      usuarios = usuario ? [usuario] : [];
    } else {
      usuarios = usuarioModel.listar();
    }
    res.render('pages/algo', { usuarios });
  } catch (error) {
    res.render('pages/algo', { 
      usuarios: [], 
      error: 'Erro ao listar usuários: ' + error.message 
    });
  }
}

function criarUsuario(req, res) {
  try {
    const { nome, email, nomeUsuario, senha } = req.body;
    const hashedSenha = bcrypt.hashSync(senha, 10); 
    usuarioModel.criar(nome, email, nomeUsuario, hashedSenha);
    // res.redirect('/algo');
  } catch (error) {
    const usuarios = usuarioModel.listar();
    res.render('pages/algo', {
      usuarios,
      error: 'Erro ao criar usuário: ' + error.message  
    });
  }
}

function login(req, res) {
  try {
    const { email, senha } = req.body;
    // busca usuário pelo e-mail
    const usuario = usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.render('pages/login', { error: 'Usuário não encontrado' });
    }

    // compara a senha fornecida com o hash armazenado
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      return res.render('pages/login', { error: 'Senha incorreta' });
    }

    req.session.usuarioId = usuario.id; 
    res.redirect('/algo');//redirecionar para a pagina do usuario se ela existir
  } catch (error) {
    res.render('pages/login', { 
      error: 'Erro ao fazer login: ' + error.message 
    });
  }
}

function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const {  nome, nomeUsuario, senha } = req.body;

    const usuarioAtualizado = usuarioModel.atualizar(parseInt(id), nome, nomeUsuario, senha);
    if (!usuarioAtualizado) {
      const usuarios = usuarioModel.listar();
      return res.render('pages/algo', { 
        usuarios, 
        error: 'Usuário não encontrado' 
      });
    }
    res.redirect('/algo');
  } catch (error) {
    const usuarios = usuarioModel.listar();
    res.render('pages/algo', { 
      usuarios, 
      error: 'Erro ao atualizar usuário: ' + error.message 
    });
  }
}

function removerUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuarioRemovido = usuarioModel.remover(parseInt(id));
    if (!usuarioRemovido) {
      const usuarios = usuarioModel.listar();
      return res.render('pages/algo', { 
        usuarios, 
        error: 'Usuário não encontrado' 
      });
    }
    // apaga as postagens do usuario
    const postModel = require('../models/postModel');
    const post = postModel.listar();
    post.forEach(post => {
      if (post.userId === parseInt(id)) {
        postModel.remover(post.id);
      }
    });
    res.redirect('/algo');
  } catch (error) {
    const usuarios = usuarioModel.listar();
    res.render('pages/algo', { 
      usuarios, 
      error: 'Erro ao remover usuário: ' + error.message 
    });
  }
}



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
    removerUsuario,
    atualizarUsuario,
    pagina
}