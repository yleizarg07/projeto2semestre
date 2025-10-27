const comentarioModel = require('../models/comentarioModel');
const postModel = require('../models/postModel');
const usuarioModel = require('../models/usuarioModel');

function listarComentarios(req, res) {
  try {
    const { categoria } = req.query;

    let comentarios;
    if (categoria) {
      comentarios = comentarioModel.listarPorCategoria(categoria); 
      comentarios = comentarioModel.listar(); 
    }

    const comentariosComUsuario = comentarios.map(comentario => {
      const postagem = postModel.buscarPorId(comentario.postId);
      return {
        ...comentario,
        id_usuario: comentario.userId !== undefined ? comentario.userId : null,
        nome_usuario: comentario.userId ? (usuarioModel.buscarPorId(comentario.userId)?.nome || null) : null,
        titulo_postagem: postagem ? postagem.titulo : null, 
        categoria_postagem: postagem ? postagem.categoria : null 
      };
    });

    res.render('pages/comentarios', { comentarios: comentariosComUsuario });
  } catch (error) {
    res.render('pages/comentarios', {
      comentarios: [],
      error: 'Erro ao listar comentários: ' + error.message
    });
  }
}

function criarComentario(req, res) {
  try {
    const { usuarioId } = req.session; 
    const { postId, conteudo } = req.body; 
    if (!conteudo || !postId) {
      return res.render('pages/criarComentario', { error: 'Conteúdo e Postagem são obrigatórios.' });
    }

    const postagem = postModel.buscarPorId(postId);
    if (!postagem) {
      return res.render('pages/criarComentario', { error: 'Postagem não encontrada.' });
    }

    const novoComentario = comentarioModel.criar(conteudo, usuarioId, postId);

    res.redirect(`/algo?categoria=${postagem.categoria}`); 
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao criar comentário: ' + error.message
    });
  }
}

function atualizarComentario(req, res) {
  try {
    const { id } = req.params; 
    const { senha, conteudo } = req.body; 
    const { usuarioId } = req.session; 

    if (!conteudo) {
      return res.render('pages/algo', { error: 'Conteúdo é obrigatório.' });
    }

    const comentario = comentarioModel.buscarPorId(parseInt(id));
    if (!comentario || comentario.userId !== usuarioId) {
      return res.render('pages/algo', { error: 'Comentário não encontrado ou você não tem permissão para editá-lo.' });
    }

    const usuario = usuarioModel.buscarPorId(usuarioId);
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      return res.render('pages/algo', { error: 'Senha incorreta.' });
    }

    const comentarioAtualizado = comentarioModel.atualizar(parseInt(id), conteudo);
    const comentarioComUsuario = {
      ...comentarioAtualizado,
      id_usuario: comentarioAtualizado.userId !== undefined ? comentarioAtualizado.userId : null,
      nome_usuario: (comentarioAtualizado.userId !== undefined && usuarioModel.buscarPorId(comentarioAtualizado.userId)) ? usuarioModel.buscarPorId(comentarioAtualizado.userId).nome : null
    };

    res.redirect(`/algo?categoria=${comentarioComUsuario.categoria_postagem}`); 
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao atualizar comentário: ' + error.message
    });
  }
}

function excluirComentario(req, res) {
  try {
    const { id } = req.params; 
    const { usuarioId } = req.session;
    const comentario = comentarioModel.buscarPorId(parseInt(id));
    if (!comentario || comentario.userId !== usuarioId) {
      return res.render('pages/algo', { error: 'Comentário não encontrado ou você não tem permissão para excluí-lo.' });
    }

    comentarioModel.remover(parseInt(id)); 
    res.redirect('/algo'); 
  } catch (error) {
    res.render('pages/algo', {
      error: 'Erro ao excluir comentário: ' + error.message
    });
  }
}

module.exports = {
  listarComentarios,
  criarComentario,
  atualizarComentario,
  excluirComentario
};
