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

function alterarComentario(senha, com_id, novosDados) {
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
    criarComentario,
    alterarComentario,
    excluirComentario
};