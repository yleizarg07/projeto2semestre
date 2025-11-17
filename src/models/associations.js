const Usuario = require("./usuarioModel");
const Post = require("./postModel");
const Comentario = require("./comentarioModel");

// Post -> Comentario
Post.hasMany(Comentario, { foreignKey: "comentPost" });
Comentario.belongsTo(Post, { foreignKey: "comentPost" });

// Usuario -> Post
Usuario.hasMany(Post, { foreignKey: "postUsuario" });
Post.belongsTo(Usuario, { foreignKey: "postUsuario" });

// Usuario -> Comentario
Usuario.hasMany(Comentario, { foreignKey: "comentUsua" });
Comentario.belongsTo(Usuario, { foreignKey: "comentUsua" });

module.exports = {
    Usuario,
    Post,
    Comentario
};
