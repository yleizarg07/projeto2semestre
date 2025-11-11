/*Banco de Dados provisório :D
let posts = [
    { post_id: 1, titulo: 'Testes', conteudo: 'Conteúdo do post de testes', categoria: 'Teste', usuario_id: 1 },
];

//Funções geradas pelo vs code(vou fazer ajustes depois)

function criarPostagem(titulo, conteudo, categoria, usuario_id) {
    const novaPostagem = {
        post_id: posts.length + 1,
        titulo,
        conteudo,
        categoria,
        usuario_id
    };
    posts.push(novaPostagem);
    return novaPostagem;
}

//atualizar postagem
function alterarPostagem(senha, post_id, novosDados) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    const postagem = posts.find(p => p.post_id === post_id && p.usuario_id === usuario.usuario_id);
    if (!postagem) {
        throw new Error('Postagem não encontrada ou você não tem permissão para editá-la');
    }

    Object.assign(postagem, novosDados);
    return postagem;
}

function listarPostagensPorUsuario(senha) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    return posts.filter(p => p.usuario_id === usuario.usuario_id);
}

function listarPostagensPorCategoria(categoria) {
    return posts.filter(p => p.categoria === categoria);
}



function deletarPostagem(senha, post_id) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }   
    const postagemIndex = posts.findIndex(p => p.post_id === post_id && p.usuario_id === usuario.usuario_id);
    if (postagemIndex === -1) {
        throw new Error('Postagem não encontrada ou você não tem permissão para deletá-la');
    }
    posts.splice(postagemIndex, 1);
}

module.exports = {
    criarPostagem,
    alterarPostagem,
    listarPostagensPorUsuario,
    listarPostagensPorCategoria,
    deletarPostagem
};*/
// models/postModel.js

let postagens = [
  {
    id: 1,
    conteudo: "Primeira postagem de exemplo",
    userId: 1,
    categoria: "Geral",
    data: new Date()
  }
];

// gera IDs automáticos
function gerarId() {
  return postagens.length > 0 ? postagens[postagens.length - 1].id + 1 : 1;
}

// lista todas as postagens, podendo filtrar por usuário ou categoria
function listar(usuarioId, categoria) {
  let resultado = [...postagens];

  if (usuarioId) {
    resultado = resultado.filter(p => p.userId === usuarioId);
  }

  if (categoria && categoria.trim() !== '') {
    resultado = resultado.filter(
      p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  return resultado;
}

// busca uma postagem específica pelo ID
function buscarPorId(id) {
  return postagens.find(p => p.id === id);
}

// cria uma nova postagem
function criar(conteudo, usuarioId, categoria) {
  const novaPostagem = {
    id: gerarId(),
    conteudo,
    userId: usuarioId,
    categoria: categoria || "Geral",
    data: new Date()
  };

  postagens.push(novaPostagem);
  return novaPostagem;
}

// atualiza uma postagem existente
function atualizar(id, conteudo, categoria) {
  const index = postagens.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Postagem não encontrada');
  }

  postagens[index].conteudo = conteudo;
  postagens[index].categoria = categoria || postagens[index].categoria;
  postagens[index].data = new Date(); // atualiza data
  return postagens[index];
}

// remove uma postagem
function remover(id) {
  const index = postagens.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Postagem não encontrada');
  }

  postagens.splice(index, 1);
  return true;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

