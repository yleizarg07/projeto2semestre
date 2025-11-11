/*/Banco de Dados provisório :D
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
};*/
// models/usuarioModel.js

let usuarios = [
  // exemplo inicial
  {
    id: 1,
    nome: "Usuário Exemplo",
    email: "exemplo@email.com",
    nomeUsuario: "exemplo123",
    senha: "$2a$10$abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef", // senha hash fictícia
    sociais: {
      relacionamento: "solteiro(a)",
      aniversario: "2000-01-01",
      idade: 25,
      interesses: "tecnologia, música",
      hobbies: "programar, ler",
      estilo: "casual",
      animaisEstimacao: "gato",
      paixoes: "computação",
      humor: "tranquilo"
    }
  }
];

// gera IDs automáticos
function gerarId() {
  return usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;
}

// lista todos os usuários
function listar() {
  return [...usuarios];
}

// busca usuário por ID
function buscarPorId(id) {
  return usuarios.find(u => u.id === id);
}

// busca usuário por e-mail
function buscarPorEmail(email) {
  return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// cria um novo usuário
function criar(nome, email, nomeUsuario, senha) {
  if (buscarPorEmail(email)) {
    throw new Error("E-mail já cadastrado.");
  }

  const novoUsuario = {
    id: gerarId(),
    nome,
    email,
    nomeUsuario,
    senha, // já vem com hash do controller
    sociais: {}
  };

  usuarios.push(novoUsuario);
  return novoUsuario;
}

// atualiza informações principais (nome, nomeUsuario, senha)
function atualizar(id, nome, nomeUsuario, senha) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) return null;

  if (nome) usuarios[index].nome = nome;
  if (nomeUsuario) usuarios[index].nomeUsuario = nomeUsuario;
  if (senha) usuarios[index].senha = senha; // senha já com hash

  return usuarios[index];
}

// atualiza informações sociais
function atualizarSociais(id, dadosSociais) {
  const usuario = buscarPorId(id);
  if (!usuario) return null;

  // se o usuário ainda não tiver o campo sociais, cria
  if (!usuario.sociais) usuario.sociais = {};

  // mescla os dados fornecidos
  usuario.sociais = { ...usuario.sociais, ...dadosSociais };

  return usuario;
}

// remove usuário
function remover(id) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) return null;

  const removido = usuarios.splice(index, 1)[0];
  return removido;
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorEmail,
  criar,
  atualizar,
  atualizarSociais,
  remover
};
