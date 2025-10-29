//Banco de Dados provisório :D
let users = [
    { usuario_id: 1, nome: 'AlexOGrande', nome_usuario: 'alex.grande', email: 'alex.grande@example.com', senha: 'dei@ocu', quantiPosts: 1 },
    { usuario_id: 2, nome: 'AlexOPequeno', nome_usuario: 'alex.pitico', email: 'alex.pitico@example.com', senha: 'dei@abunda', quantiPosts: 0 }
];

 //Funções geradas pelo vs code(vou fazer ajustes depois)
function cadastrarUsuario(nome, nome_usuario, email, senha) {
    const novoUsuario = {
        usuario_id: users.length + 1,
        nome,
        nome_usuario,
        email,
        senha,
        quantiPosts: 0
    };
    users.push(novoUsuario);
    return novoUsuario;
}

function editarUsuario(senha, novosDados) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    Object.assign(usuario, novosDados);
    return usuario;
}



function exibirUsuario(senha) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    return usuario;
}

function excluirUsuario(senha) {
    const usuarioIndex = users.findIndex(u => u.senha === senha);
    if (usuarioIndex === -1) {
        throw new Error('Usuário não encontrado');
    }
    // Remover postagens e comentários associados
    users.splice(usuarioIndex, 1);
}

module.exports = {
    cadastrarUsuario,
    editarUsuario,
    exibirUsuario,
    excluirUsuario
};