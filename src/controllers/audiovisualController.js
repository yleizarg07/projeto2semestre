const path = require('path');
const audiovisualModel = require('../models/audiovisualModel');

function listarAudiovisual(req, res) {
  try {
    const { id } = req.query;

    let audiovisual;
    if (id) {
      const audiovisual = audiovisualModel.buscarPorId(parseInt(id));
      audiovisual = audiovisual ? [audiovisual] : [];
    } else {
      audiovisual = audiovisualModel.listar();
    }
    res.render('pages/algo', { audiovisual });
  } catch (error) {
    res.render('pages/algo', { 
      audiovisualModel: [], 
      error: 'Erro ao listar usuários: ' + error.message 
    });
  }
}

function criarAudiovisual(req, res) {
    try {
        const {titulo, ano, descricao, formato, resumo, sinopse, atores, diretor, localPostagem, diretosAutorais} = req.body;
        usuarioModel.criar( titulo, ano, descricao, formato, resumo, sinopse, atores, diretor, localPostagem, diretosAutorais);
       // res.redirect('/algo');
    }
    catch (error) {
        const audiovisual = audiovisualModel.listar()
        res.render('pages/algo', {
        audiovisual,
    error:'Erro ao postar audiovisual: ' + error.message  });
    }
}

function atualizarAudiovisual(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, resumo, sinopse, atores, localPostagem, diretosAutorais } = req.body;

    const audiovisualAtualizado = audiovisualModel.atualizar(parseInt(id),titulo, descricao, resumo, sinopse, atores, localPostagem, diretosAutorais);
    if (!audiovisualAtualizado) {
      const audiovisual = audiovisualModel.listar();
      return res.render('pages/algo', { 
        audiovisual, 
        error: 'Audiovisual não encontrado' 
      });
    }
    res.redirect('/algo');
  } catch (error) {
    const audiovisual = usuarioModel.listar();
    res.render('pages/algo', { 
      usuarios, 
      error: 'Erro ao atualizar o audiovisual: ' + error.message 
    });
  }
}

function removerAudiovisual(req, res) {
  try {
    const { id } = req.params;
    const audiovisualRemovido = audiovisualModel.remover(parseInt(id));
    if (!audiovisualRemovido) {
      const audiovisual = audiovisualModel.listar();
      return res.render('pages/algo', { 
        audiovisual, 
        error: 'Audiovisual não encontrada' 
      });
    }
    res.redirect('/algo');
  } catch (error) {
    const audiovisual = audiovisualModel.listar();
    res.render('pages/algo', { 
      audiovisual, 
      error: 'Erro ao remover audiovisual: ' + error.message 
    });
  }
}

function pagina(req, res) {
  try {
    const audiovisual = audiovisualModel.listar();
    res.render('pages/algo', { audiovisual });
  } catch (error) {
    res.render('pages/algo', { 
      audiovisual: [], 
      error: 'Erro ao carregar a pagina: ' + error.message 
    });
  }
}

module.exports = {
    listarAudiovisual,
    criarAudiovisual,
    removerAudiovisual,
    atualizarAudiovisual,
    pagina
}