const path = require('path');
const audiovisualModel = require('../models/avaliacoesModel');

/*function listarAvaliacoes(req, res) {
  try {
    const { feito, id, userId } = req.query;

    let resultados;
    if (id) {
      const tarefa = TarefasModel.buscarPorId(parseInt(id));
      if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
      }
      resultados = [tarefa];
    } else {
      resultados = TarefasModel.listar(feito);
    }

    const usuarioModel = require('../models/usuarioModel');
      const tarefasComUsuario = resultados.map(tarefa => {
        return {
          ...tarefa,
          id_usuario: tarefa.userId !== undefined ? tarefa.userId : null,
          nome_usuario: tarefa.userId ? (usuarioModel.buscarPorId(tarefa.userId)?.nome || null) : null
        };
      });

      res.render('pages/form', { tarefas: tarefasComUsuario });
  } catch (error) {
    res.render('pages/form', { 
      tarefas: [], 
      error: 'Erro ao listar tarefas: ' + error.message 
    });
  }
}*/

function criarAvaliação(req, res) {
    try {
        const { nota, titulo, comentario, filme} = req.body;
        usuarioModel.criar( nota, titulo, comentario, filme);
       // res.redirect('/algo');
    }
    catch (error) {
        const avaliacoes = avaliacoesModel.listar()
        res.render('pages/algo', {
        avaliacoes,
    error:'Erro ao criar avaliação: ' + error.message  });
    }
}

/*function atualizarAvaliacao(req, res) {
  try {
    const { id } = req.params;
    const { descricao, concluida, userId } = req.body;

    const tarefaAtualizada = TarefasModel.atualizar(parseInt(id), descricao, concluida, userId);
    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    // Monta resposta igual ao listarTarefas
    const usuarioModel = require('../models/usuarioModel');
    const tarefaComUsuario = {
      ...tarefaAtualizada,
      id_usuario: tarefaAtualizada.userId !== undefined ? tarefaAtualizada.userId : null,
      nome_usuario: (tarefaAtualizada.userId !== undefined && usuarioModel.buscarPorId(tarefaAtualizada.userId)) ? usuarioModel.buscarPorId(tarefaAtualizada.userId).nome : null
    };
    res.redirect('/formulario');
  } catch (error) {
    res.render('pages/form', { 
      tarefas: [], 
      error: 'Erro ao atualizar tarefa: ' + error.message 
    });
  }
} */

  function removerAvaliacao(req, res) {
  try {
    const { id } = req.params;
    const avaliacaoRemovida = avaliacoesModel.remover(parseInt(id));
    if (!avaliacaoRemovida) {
      const avaliacoes = avaliacaoRemovida.listar();
      return res.render('pages/algo', { 
        avaliacoes, 
        error: 'Avaliação não encontrada' 
      });
    }
    res.redirect('/algo');
  } catch (error) {
    const avaliacoes = avaliacoesModel.listar();
    res.render('pages/algo', { 
      avaliacoes, 
      error: 'Erro ao remover avaliação: ' + error.message 
    });
  }
}

function pagina(req, res) {
  try {
    const avaliacao = avaliacoesModel.listar();
    const usuarioModel = require('../models/usuarioModel');
    const avaliacoesComUsuario = avaliacao.map(avaliacao => {
      return {
        ...avaliacao,
        id_usuario: avaliacao.userId !== undefined ? avaliacao.userId : null,
        nome_usuario: avaliacao.userId ? (usuarioModel.buscarPorId(avaliacao.userId)?.nome || null) : null
      };
    });
    res.render('pages/algo', { avaliacao: avaliacoesComUsuario });
  } catch (error) {
    res.render('pages/algo', { 
      avaliacoes: [], 
      error: 'Erro ao carregar avaliações: ' + error.message 
    });
  }
}

module.exports = {
  listarAvaliacoes,
  criarAvaliação,
  atualizarAvaliacao,
  removerAvaliacao,
  pagina
};