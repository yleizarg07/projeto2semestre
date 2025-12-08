const path = require("path");
const bcrypt = require("bcryptjs");
const UsuarioModel = require("../models/usuarioModel");
const PostModel = require("../models/postModel");
const { error } = require("console");
const tamanho_senha_minimo = 8; //numero minimo da senha

/*
 oq alguns termos são, para eu não esqucer
 -async: assíncrono 
 -await: aguarda o resultado de uma Promise
 -try/catch: bloco para tatar ede excessões
 -query: parametros da query string da URL
 -params: parâmetros da rota
 -body: corpo da requisição
 -session: sessão do usuário 
 -findAll: método do sequelize para buscar todos os registros
 -findOne/findByPk: busca um registro 
 -update: atualiza registros no banco
 -destroy: remove registros do banco
 -render: renderiza uma view com dados
 -redirect: redireciona o navegador para outra URL
*/

//lista todos os usuarios id
async function listarUsuarios(req, res) {
  try {
    //extrai o parâmetro nomeUsuario da query string
    const { nomeUsuario } = req.query; //requere o nome de usuário
    var usuarios; //variável que irá conter a lista de usuários

    if (nomeUsuario) {
      //se foi fornecido um nome de usuário na query, busca apenas esse usuário
      //UsuarioModel.findOne: busca um único registro onde nome_usuario é igual a nomeUsuario
      const usuarioEncontrado = await UsuarioModel.findOne({
        where: { nome_usuario: nomeUsuario },
      }); //busca o usuário pelo nickname
      if (!usuarioEncontrado) {
        //se não encontrou ele renderiza a página de usuários com mensagem de erro
        return res.render("pages/usuarios", {
          usuarios: [],
          error: "Usuário não encontrado",
        });
      }
      //coloca o usuário encontrado dentro de um array para manter interface consistente com findAll
      usuarios = [usuarioEncontrado]; //aqui coloca o usuário encontrado dentro de um array
    } else {
      //se não foi fornecido filtro ele busca todos os usuários
      usuarios = await UsuarioModel.findAll({
        attributes: ["idUsuario", "nome", "nome_usuario"],
      }); //retorna todos os usuários
    }

    //renderiza a view de listagem de usuários passando o array 'usuarios'
    return res.render("pages/usuarios", { usuarios }); //renderiza a página com a lista de usuários
  } catch (error) {
    //se ocorrer qualquer erro dentro do try ele vem pra cá cai aqui
    console.error("Erro ao listar usuários:", error);
    return res.status(500).render("pages/usuarios", {
      usuarios: [],
      error: "Erro ao listar usuários: " + error.message,
    });
  }
}

async function listarSocial(req, res) {
  try {
    //idUsuario é o identificador do usuário armazenado na sessão
    const idUsuario = req.session.idUsuario; //requere o id do usuario logado
    if (!idUsuario) {
      //se não há id na sessão o usuário precisa fazer login
      return res.status(401).redirect("/usuarios/login");
    }

    //busca o registro do usuário pelo id
    const usuario = await UsuarioModel.findOne({
      where: { idUsuario },
      //attributes = lista dos campos que queremos retornar do banco
      attributes: [
        "idUsuario",
        "nome",
        "nome_usuario",
        "relacionamento",
        "aniversario",
        "idade",
        "interesses",
        "hobbies",
        "estilo",
        "animaisEstimacao",
        "paixoes",
        "humor",
      ],
    });

    if (!usuario) {
      return res.status(404).render("pages/erro", { error: "Usuário não encontrado" });
    }

        const camposSociais = [
      "relacionamento",
      "aniversario",
      "idade",
      "interesses",
      "hobbies",
      "estilo",
      "animaisEstimacao",
      "paixoes",
      "humor",
    ];

    //verifica se o campo não tem valor
    const naoTemSocial = camposSociais.every((campo) => {
      const v = usuario[campo];
      return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
    });
    return res.render("pages/socialUsuario", {
      usuario,
      naoTemSocial,
    });
    //renderiza a página que mostra os dados sociais do usuário
  } catch (error) {
    //erro no servidor e render de página de erro
    console.error("Erro ao listar dados sociais:", error);
    return res.status(500).render("pages/erro", { error: "Erro ao listar dados sociais: " + error.message, });
  }
}

async function criarUsuario(req, res) {
  try {
    //são campos enviados pelo formulário:
    const { nome, email, nomeUsuario, senha, senha2 } = req.body; //requere os envios do usuario

    //verfica se as os campos foram preenchidos
    if (!nome || !email || !nomeUsuario || !senha || !senha2) {
      return res.status(400).render("pages/cadastro", { error: "Preencha os campos necessarios" });
    }

    //comnpara as senhas
    if (senha != senha2) {
      return res.status(400).render("pages/cadastro", { error: "As senhas são diferentes" });
    }

    //verifica o tamanho minimo da senha
    if ((senha || "").trim().length < tamanho_senha_minimo) {
      return res.status(400).render("pages/cadastro", { error: "A senha deve ter pelo menos 8 caracteres." });
    }

    //hashedSenha é aversão criptografada da senha, a impressão digital
    const hashedSenha = await bcrypt.hash(senha, 10); //põe a impressão digital na senha

    //cria o usuário no banco
    await UsuarioModel.create({
      nome: nome,
      nome_usuario: nomeUsuario,
      email: email,
      senha: hashedSenha,
      quanti_post: 0,
    });
    //redireciona para a lista de usuários
    return res.status(201).redirect("/usuarios/login");
  } catch (error) {
    //em caso de erro ele loga no servidor e renderiza a view de usuários com mensagem
    console.error("Erro ao criar usuário:", error);
    return res.status(500).render("pages/cadastro", {
      error: "Erro ao criar usuário: " + error.message,
    });
  }
}

async function criarSocial(req, res) {
  try {
    //campos do social enviados no body
    const {
      relacionamento,
      aniversario,
      idade,
      interesses,
      hobbies,
      estilo,
      animaisEstimacao,
      paixoes,
      humor,
    } = req.body; //requere as informações enviadas pelo usuario
    //verifica se todos os campos foram preenchidos

    //pega id do usuário da sessão
    const idUsuario = req.session.idUsuario;
    if (!idUsuario) return res.status(401).redirect("/usuarios/login");

    //monta objeto com os campos que irão ser atualizados
    const dados = {
      relacionamento,
      aniversario,
      idade,
      interesses,
      hobbies,
      estilo,
      animaisEstimacao,
      paixoes,
      humor,
    };

    // remove campos não preenchidos (undefined, null ou string vazia)
    Object.keys(dados).forEach((k) => {
      const v = dados[k];
      if (v === undefined || v === null) {
        delete dados[k];
        return;
      }
      if (typeof v === "string" && v.trim() === "") {
        delete dados[k];
        return;
      }
      if (k === "idade") {
        const n = parseInt(v, 10);
        if (Number.isNaN(n)) delete dados[k]; //number.isnan checa se o parseInt falhou
        else dados[k] = n;
      }
    });

    //faz update no banco e verifica quantos registros foram afetados
    const [atualizados] = await UsuarioModel.update(dados, {
      where: { idUsuario },
    });
    if (!atualizados)
      return res.status(404).render("pages/erro", { error: "Usuário não encontrado" });

    return res.status(200).redirect("/usuarios");
  } catch (error) {
    console.error("Erro ao criar social do usuário:", error);
    return res.status(500).render("pages/erro", {error: "Erro ao criar social do usuário: " + error.message, });
    }
}

async function atualizarSocial(req, res) {
  try {
    const { id } = req.params; //id vindo na rota
    const {
      relacionamento,
      aniversario,
      idade,
      interesses,
      hobbies,
      estilo,
      animaisEstimacao,
      paixoes,
      humor,
    } = req.body; //dados do formulário

    if (
      !relacionamento === undefined &&
      !aniversario === undefined &&
      !idade === undefined &&
      !interesses   === undefined &&
      !hobbies === undefined &&
      !estilo === undefined &&
      !animaisEstimacao === undefined &&
      !paixoes === undefined &&
      !humor === undefined
    ) {
      return res.status(400).render("pages/erro", {
        error: "Por favor, preencha ao menos um campo para atualizar."
      });
    }

    const dadosSociais = {
      relacionamento,
      aniversario,
      idade,
      interesses,
      hobbies,
      estilo,
      animaisEstimacao,
      paixoes,
      humor,
    };
    //remove os campos indefinidos
    Object.keys(dadosSociais).forEach((key) => {
      const v = dadosSociais[key];
      if (v === undefined || v === null) {
        dadosSociais[key] = null;
        return;
      }
      if (typeof v === "string" && v.trim() === "") {
        dadosSociais[key] = null;
        return;
      }
      if (key === "idade") {
        const n = parseInt(v, 10);
        dadosSociais[key] = Number.isNaN(n) ? null : n;
         //number.isnan checa se o parseInt falhou
        
      }
    });

    //ao chamar o update ele retorna a quantidade de linhas atualizadas
    const [atualizados] = await UsuarioModel.update(dadosSociais, {
      where: { idUsuario: parseInt(id) },
    });
    if (!atualizados) {
      const usuarioExistente = await UsuarioModel.findByPk(id);
      if (!usuarioExistente) {
        return res.status(404).render("pages/erro", { error: "Usuário não encontrado" });
      }
    }
      //se nada foi atualizado ele retorna o erro 404

    return res.status(200).redirect("/usuarios");
  } catch (error) {
    console.error("Erro ao atualizar informações sociais:", error);
    return res.status(500).render("pages/erro", {error: "Erro ao atualizar informações sociais: " + error.message,});
  }
}

async function login(req, res) {
  try {
    //campos do formulário de login
    const { email, senha } = req.body; //requere o email e a senha enviados pelo usuario

    // busca usuário por email
    const usuarioEncontrado = await UsuarioModel.findOne({ where: { email } }); //findOne busca um unico registro no bd

    if (!usuarioEncontrado) {
      //404 é que o usuário não existe
      return res.status(404).render("pages/login", {error: "Usuário não encontrado, faça seu cadastro", });
    }

    //compara senha enviada com o hash armazenado
    const senhaValida = await bcrypt.compare(
      senha,
      usuarioEncontrado.senha
    ); //compara as senhas

    if (!senhaValida) {
      return res.status(401).render("pages/login", { error: "Senha incorreta" });
    }

    //grava id do usuário na sessão para autenticação em requisições futuras
    req.session.idUsuario = usuarioEncontrado.idUsuario;

    //redireciona para página de posts ao logar com sucesso
    return res.status(200).redirect("/posts");
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).render("pages/login", {
      error: "Erro ao fazer login: " + error.message,
    });
  }
}

async function logout(req, res) {
  try {
    // destrói a sessão do usuário
    req.session.destroy();
    // redireciona para a página de principal
    return res.status(200).redirect("/");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return res.status(500).render("pages/erro", {error: "Erro ao fazer logout: " + error.message,});
  }
}

async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;

    const { nome, nomeUsuario, senha: senhaNova, senha2, senhaAtual } = req.body;

    // buscar usuário e garantir que traz o hash da senha
    const usuario = await UsuarioModel.findOne({
      where: { idUsuario: parseInt(id, 10) },
      attributes: ["idUsuario", "nome", "nome_usuario", "senha"],
    });

    if (!usuario) {
      return res.status(404).render("pages/editarUsuario", {
        usuario: null,
        error: "Usuário não encontrado",
      });
    }

    // monta objeto com campos que atualizamos
    const dadosAtualizados = {
      nome,
      nome_usuario: nomeUsuario,
    };

    // Se o usuário não quer mudar a senha atualiza só nome/nome_usuario

     if (senhaAtual && !senhaNova) {
      return res.render("pages/editarUsuario", {
        usuario,
        error: "Digite a nova senha para alterar.",
      });
    }

    if (!senhaNova || senhaNova.trim() === "") {
      await UsuarioModel.update(dadosAtualizados, {
        where: { idUsuario: parseInt(id, 10) },
      });
      return res.redirect("/usuarios");
    }

    // senhaAtual precisa existir
    if (!senhaAtual || senhaAtual.trim() === "") {
      return res.render("pages/editarUsuario", {
        usuario,
        error: "Digite sua senha atual para alterar a senha.",
      });
    }

    // verificar senhaAtual comparando com do banco de dados
    const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaAtualValida) {
      return res.render("pages/editarUsuario", {
        usuario,
        error: "Senha atual incorreta.",
      });
    }

    // confirmar nova senha
    if (!senha2 || senhaNova !== senha2) {
      return res.render("pages/editarUsuario", {
        usuario,
        error: "A confirmação da nova senha não corresponde.",
      });
    }

    //verifica o tamanho minimo da nova senha
    if ((senhaNova || "").trim().length < tamanho_senha_minimo) {
      return res.render("pages/editarUsuario", {
        usuario,
        error: "A nova senha deve ter pelo menos 8 caracteres.",
      });
    }

    // só agora gera o hash da nova senha e atribuir aos dados atualizados
    const hashNova = await bcrypt.hash(senhaNova, 10);
    dadosAtualizados.senha = hashNova;

    // atualiza tudo de uma vez
    await UsuarioModel.update(dadosAtualizados, {
      where: { idUsuario: parseInt(id, 10) },
    });

    return res.redirect("/usuarios");
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return res.status(500).render("pages/erro", {
      error: "Erro ao atualizar usuário: " + err.message,
    });
  }
}


async function removerUsuario(req, res) {
  try {
    const { id } = req.params; //id do usuário a ser removido
    const idUsuario = parseInt(id); //converte para inteiro

    const removidos = await UsuarioModel.destroy({ where: { idUsuario } }); //destroi registros com essa condição

    if (!removidos) {
      return res.status(404).render("pages/erro", { error: "Usuário não encontrado" });
    }

    req.session.destroy(err => {
      if (err) {
        console.error("Erro ao destruir a sessão:", err);
        return res.redirect("/"); // mesmo com erro, manda pra home
      }
      res.clearCookie("connect.sid");

      return res.redirect("/");
    });

  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    return res.status(500).render("pages/erro", {
        error: "Erro ao remover usuário: " + error.message,
      });
  }
}

// carrega página inicial da listagem de usuários
async function paginaUsuario(req, res) {
  try {
    const usuarios = await UsuarioModel.findAll({
      attributes: ["idUsuario", "nome", "nome_usuario"],
    });
    return res.render("pages/usuarios", { usuarios });
  } catch (error) {
    console.error("Erro ao carregar a página de usuários:", error);
    return res
      .status(500)
      .render("pages/erro", {
        error: "Erro ao carregar a página: " + error.message,
      });
  }
}

//renderiza a página de login
function mostraLogin(req, res) {
  return res.status(200).render("pages/login", { error: null });
}

function mostraCadastro(req, res) {
  return res.status(200).render("pages/cadastro", { error: null });
}

async function buscarUsuarios(req, res) {
  try {
    const { nome } = req.query;
    if (!nome || nome.trim() === "") {
      return res.render("pages/buscaUsuarios", {
        usuarios: [],
        nome,
        error: "Digite um nome para buscar.",
      });
    }
    const { Op } = require("sequelize");
    const usuarios = await UsuarioModel.findAll({
      where: {
        nome_usuario: {
          [Op.like]: `%${nome}%`,
        },
      },
      attributes: ["idUsuario", "nome", "nome_usuario"],
    });
    return res.render("pages/buscaUsuarios", { usuarios, nome, error: null });
  } catch (error) {
    console.error("Erro na busca:", error);
    return res.status(500).render("pages/buscaUsuarios", {
        usuarios: [],
        nome: "",
        error: "Erro ao buscar usuários.",
      });
  }
}

async function mostraEditarUsuario(req, res) {
  try {
    const idUsuario = req.session.idUsuario;
    if (!idUsuario) return res.redirect("/usuarios/login");

    const usuario = await UsuarioModel.findOne({
      where: { idUsuario },
      attributes: ["idUsuario", "nome", "nome_usuario"],
    });

    return res.render("pages/editarUsuario", { usuario });
  } catch (error) {
    console.error("Erro ao carregar edição de usuário:", error);
    return res.status(500).render("pages/erro", { error: "Erro ao carregar edição" });
  }
}

async function verPerfilSocial(req, res) {
  try {
    const { id } = req.params;

    const usuario = await UsuarioModel.findOne({
      where: { idUsuario: parseInt(id) },
      attributes: ["idUsuario", "nome", "nome_usuario", "relacionamento", "aniversario", "idade", "interesses", "hobbies", "estilo", "animaisEstimacao", "paixoes", "humor"],
    });

    if (!usuario) {
      return res.status(404).render("pages/erro", { error: "Usuário não encontrado" });
    }

    return res.render("pages/perfilSocialOutro", { usuario });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    return res.status(500).render("pages/erro", {
      error: "Erro ao carregar perfil social",
    });
  }
}

function formCriarSocial(req, res) {
  const idUsuario = req.session.idUsuario;
  if (!idUsuario) return res.redirect("/usuarios/login");

  return res.render("pages/criarSocial", { error: null });
}

async function mostraEditarSocial(req, res) {
  try {
    const { id } = req.params;

    // Busca o usuário pelo ID e pega só os campos sociais
    const usuario = await UsuarioModel.findOne({
      where: { idUsuario: parseInt(id, 10) },
      attributes: [
      "idUsuario",
      "relacionamento",
      "aniversario",
      "idade",
      "interesses",
      "hobbies",
      "estilo",
      "animaisEstimacao",
      "paixoes",
      "humor"
      ]
    });

  if (!usuario) {
    return res
      .status(404)
      .render("pages/erro", { error: "Dados sociais não encontrados." });
  }

    return res.render("pages/editarSocial", { usuario });
} catch (error) {
  console.error("Erro ao carregar edição social:", error);
  return res
    .status(500)
    .render("pages/erro", {
      error: "Erro ao carregar página de edição social."
    });
}
}

async function removerSocial(req, res) {
  try {
    const { id } = req.params;

    // Zera todos os campos sociais
    const dadosVazios = {
      relacionamento: null,
      aniversario: null,
      idade: null,
      interesses: null,
      hobbies: null,
      estilo: null,
      animaisEstimacao: null,
      paixoes: null,
      humor: null
    };

    // Atualiza no banco
    const [atualizados] = await UsuarioModel.update(dadosVazios, {
      where: { idUsuario: parseInt(id, 10) },
    });

    if (!atualizados) {
      return res.status(404)
        .render("pages/erro", { error: "Usuário não encontrado" });
    }

    return res.redirect(`/usuarios/listar/social`);
  } catch (error) {
    console.error("Erro ao remover informações sociais:", error);
    return res.status(500).render("pages/erro", {
      error: "Erro ao remover informações sociais: " + error.message,
    });
  }
}




module.exports = {
  listarUsuarios,
  criarUsuario,
  criarSocial,
  atualizarSocial,
  atualizarUsuario,
  removerUsuario,
  listarSocial,
  login,
  pagina: paginaUsuario,
  mostraLogin,
  mostraCadastro,
  buscarUsuarios,
  logout,
  mostraEditarUsuario,
  verPerfilSocial,
  formCriarSocial,
  mostraEditarSocial,
  removerSocial 
};