const postModel = require('../models/postModel');
const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs'); 

function listarPostagens(req, res) {
  try {
    const { usuarioId, id, categoria } = req.query; 

    let postagens;
    if (id) {
      const postagem = postModel.buscarPorId(parseInt(id));
      if (!postagem) {
        return res.status(404).json({ erro: 'Postagem não encontrada' });
      }
      postagens = [postagem];
    } else {
      postagens = postModel.listar(usuarioId, categoria); 
    }

    const postagensComUsuario = postagens.map(postagem => {
      return {
        ...postagem,
        id_usuario: postagem.userId !== undefined ? postagem.userId : null,
        nome_usuario: postagem.userId ? (usuarioModel.buscarPorId(postagem.userId)?.nome || null) : null,
        categoria_postagem: postagem.categoria || 'Sem categoria'  
      };
    });

    res.render('pages/algo', { postagens: postagensComUsuario });
  } catch (error) {
    res.render('pages/algo', {
      postagens: [],
      error: 'Erro ao listar postagens: ' + error.message
    });
  }
}

function criarPostagem(req, res) {
  try {
    const { usuarioId } = req.session;
    const { conteudo, categoria } = req.body;  

    if (!conteudo) {
      return res.render('pages/criarPostagem', { error: 'Conteúdo da postagem é obrigatório.' });
    }

    const novaPostagem = postModel.criar(conteudo, usuarioId, categoria); 
    
    const postagemComUsuario = {
      ...novaPostagem,
      id_usuario: novaPostagem.userId !== undefined ? novaPostagem.userId : null,
      nome_usuario: (novaPostagem.userId !== undefined && usuarioModel.buscarPorId(novaPostagem.userId)) ? usuarioModel.buscarPorId(novaPostagem.userId).nome : null,
      categoria_postagem: novaPostagem.categoria || 'Sem categoria'
    };

    res.redirect(`/algo?usuarioId=${usuarioId}`);
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao criar postagem: ' + error.message
    });
  }
}

function atualizarPostagem(req, res) {
  try {
    const { id } = req.params;
    const { senha, conteudo, categoria } = req.body; 
    const { usuarioId } = req.session;

    if (!conteudo) {
      return res.render('pages/algo', { error: 'Conteúdo da postagem é obrigatório.' });
    }

    const postagem = postModel.buscarPorId(parseInt(id));
    if (!postagem || postagem.userId !== usuarioId) {
      return res.render('pages/algo', { error: 'Postagem não encontrada ou você não tem permissão para editá-la.' });
    }

    const usuario = usuarioModel.buscarPorId(usuarioId);
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      return res.render('pages/algo', { error: 'Senha incorreta.' });
    }

    const postagemAtualizada = postModel.atualizar(parseInt(id), conteudo, categoria);  
    const postagemComUsuario = {
      ...postagemAtualizada,
      id_usuario: postagemAtualizada.userId !== undefined ? postagemAtualizada.userId : null,
      nome_usuario: (postagemAtualizada.userId !== undefined && usuarioModel.buscarPorId(postagemAtualizada.userId)) ? usuarioModel.buscarPorId(postagemAtualizada.userId).nome : null,
      categoria_postagem: postagemAtualizada.categoria || 'Sem categoria'  
    };

    res.redirect(`/algo?usuarioId=${usuarioId}`);
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao editar postagem: ' + error.message
    });
  }
}

function excluirPostagem(req, res) {
  try {
    const { id } = req.params;
    const { usuarioId } = req.session;

    const postagem = postModel.buscarPorId(parseInt(id));
    if (!postagem || postagem.userId !== usuarioId) {
      return res.render('pages/algo', { error: 'Postagem não encontrada ou você não tem permissão para excluí-la.' });
    }

    postModel.remover(parseInt(id));
    res.redirect(`/algo?usuarioId=${usuarioId}`);
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao excluir postagem: ' + error.message
    });
  }
}

function pagina(req, res) {
  try {
    const postagens = postModel.listar(); 
    const postagensComUsuario = postagens.map(postagem => {
      return {
        ...postagem,
        id_usuario: postagem.userId !== undefined ? postagem.userId : null,
        nome_usuario: postagem.userId ? (usuarioModel.buscarPorId(postagem.userId)?.nome || null) : null,
        categoria_postagem: postagem.categoria || 'Sem categoria'  
      };
    });

    res.render('pages/algo', { postagens: postagensComUsuario });
  } catch (error) {
    res.render('pages/algo', {
      postagens: [],
      error: 'Erro ao carregar postagens: ' + error.message
    });
  }
}

module.exports = {
  listarPostagens,
  criarPostagem,
  atualizarPostagem,
  excluirPostagem,
  pagina
};
