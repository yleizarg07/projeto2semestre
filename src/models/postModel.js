//Banco de Dados provisório :D
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
};