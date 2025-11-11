/*const { listar } = require("./usuarioModel");

//Banco de Dados provisório :D
let comemments = [
    { com_id: 1, resposta: 'Nao curti essa coisa', usuario_id: 2, post_id: 1 },
];

//Funções geradas pelo vs code(vou fazer ajustes depois)
function criarComentario(resposta, usuario_id, post_id) {
    const novoComentario = {
        com_id: comemments.length + 1,
        resposta,
        usuario_id,
        post_id
    };
    comemments.push(novoComentario);
    return novoComentario;
}

//listar os comentarios de cada post (como no X)
function listarComentarios(){}

//se conseguir, juntar com o buscar do postModel
function buscarPorNomeUsuario(){}

function atualizarComentario(senha, com_id, novosDados) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    const comentario = comemments.find(c => c.com_id === com_id && c.usuario_id === usuario.usuario_id);
    if (!comentario) {
        throw new Error('Comentário não encontrado ou você não tem permissão para editá-lo');
    }

    Object.assign(comentario, novosDados);
    return comentario;
}

function excluirComentario(senha, com_id) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    const comentarioIndex = comemments.findIndex(c => c.com_id === com_id && c.usuario_id === usuario.usuario_id);
    if (comentarioIndex === -1) {
        throw new Error('Comentário não encontrado ou você não tem permissão para deletá-lo');
    }

    comemments.splice(comentarioIndex, 1);
}

module.exports = {
    listarComentarios,
    buscarPorNomeUsuario,
    criarComentario,
    atualizarComentario,
    excluirComentario
};*/

// models/comentarioModel.js

let comentarios = [
  // Exemplo inicial
  {
    id: 1,
    conteudo: "Comentário de exemplo",
    userId: 1,
    postId: 1,
    categoria: "Geral", // herdada da postagem, opcional
    data: new Date()
  }
];

// Gerar IDs automáticos
function gerarId() {
  return comentarios.length > 0 ? comentarios[comentarios.length - 1].id + 1 : 1;
}

// Lista todos os comentários
function listar() {
  return [...comentarios];
}

// Lista comentários de uma postagem específica
function listarPorPostId(postId) {
  return comentarios.filter(c => c.postId === postId);
}

// Lista comentários filtrando por categoria (caso exista)
function listarPorCategoria(categoria) {
  return comentarios.filter(
    c => c.categoria && c.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

// Busca um comentário pelo ID
function buscarPorId(id) {
  return comentarios.find(c => c.id === id);
}

// Cria um novo comentário
function criar(conteudo, usuarioId, postId, categoria = "Geral") {
  const novoComentario = {
    id: gerarId(),
    conteudo,
    userId: usuarioId,
    postId,
    categoria,
    data: new Date()
  };

  comentarios.push(novoComentario);
  return novoComentario;
}

// Atualiza o conteúdo de um comentário
function atualizar(id, conteudo) {
  const index = comentarios.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Comentário não encontrado');
  }

  comentarios[index].conteudo = conteudo;
  comentarios[index].data = new Date(); // atualiza data
  return comentarios[index];
}

// Remove um comentário
function remover(id) {
  const index = comentarios.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Comentário não encontrado');
  }

  comentarios.splice(index, 1);
  return true;
}

module.exports = {
  listar,
  listarPorPostId,
  listarPorCategoria,
  buscarPorId,
  criar,
  atualizar,
  remover
};
