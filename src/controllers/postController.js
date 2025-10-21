function criarPost(req, res) {
  try {
    const { comentario, userId } = req.body;
    const novoPost = postModel.criar(comentario, userId);
    // Monta resposta igual ao listarTarefas
    const usuarioModel = require('../models/usuarioModel');
    const comentarioComUsuario = {
      ...novoPost,
      id_usuario: novoPost.userId !== undefined ? novoPost.userId : null,
      nome_usuario: (novoPost.userId !== undefined && usuarioModel.buscarPorId(novoPost.userId)) ? usuarioModel.buscarPorId(novoPost.userId).nome : null
    };
    res.redirect('/algo');
  } catch (error) {
    res.render('pages/algo', { 
      posts: [], 
      error: 'Erro ao criar post: ' + error.message 
    });
  }
}