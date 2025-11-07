//Banco de Dados provisório :D
let users = [
    { usuario_id: 1, nome: 'AlexOGrande', nome_usuario: 'alex.grande', email: 'alex.grande@example.com', senha: 'dei@ocu', quantiPosts: 1 },
    { usuario_id: 2, nome: 'AlexOPequeno', nome_usuario: 'alex.pitico', email: 'alex.pitico@example.com', senha: 'dei@abunda', quantiPosts: 0 }
];

 //Funções geradas pelo vs code(vou fazer ajustes depois)
//cadastrar o usuario
const Usuario = require(".config./usuariodb"); // importa o modelo

async function criarUsuario(nome, nome_usuario, senha, email) {
    try {
        const novoUsuario = await Usuario.create({
            nome,
            nome_usuario,
            senha,
            email
            // quanti_post não precisa, tem default = 0
        });

        console.log("Usuário criado com sucesso:");
        console.log(novoUsuario.toJSON());

        return novoUsuario;
    } catch (erro) {
        console.error("Erro ao criar usuário:", erro);
        throw erro;
    }
}

module.exports = criarUsuario;


//listar todos os ususraios
function listar(){}

//buscar um usuariop por id
function buscarPorId(){}

//buscar o usuario por nome do usuario
function buscarPorNomeUsuario(){}

//criar a parte social do usuario, que é diferente do seu cadastro
function socialUsuario(){}

//atualizar a parte social do usuario
function atualizarSocial() {}

function editarUsuario(senha, novosDados) {
    const usuario = users.find(u => u.senha === senha);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
    Object.assign(usuario, novosDados);
    return usuario;
}

//exibir os dados do cadastro do usuario
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
    listar,
    buscarPorId,
    buscarPorNomeUsuario,
    socialUsuario,
    atualizarSocial,
    editarUsuario,
    exibirUsuario,
    excluirUsuario
};