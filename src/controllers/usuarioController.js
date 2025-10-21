const path = require('path');
const audiovisualModel = require('../models/usuarioModel');

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
        const { nome, email, nomeUsuario, senha} = req.body;
        usuarioModel.criar(nome, email, nomeUsuario, senha);
       // res.redirect('/algo');
    }
    catch (error) {
        const usuarios = usuarioModel.listar()
        res.render('pages/algo', {
        usuarios,
    error:'Erro ao criar usuário: ' + error.message  });
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
    // Desvincula o usuário das audiovisual
    const audiovisualModel = require('../models/audiovisualModel');
    const audiovisual = audiovisualModel.listar();
    audiovisual.forEach(audiovisual => {
      if (audiovisual.userId === parseInt(id)) {
        delete audiovisual.userId;
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