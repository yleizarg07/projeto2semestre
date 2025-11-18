const usuarioModel = require('../models/usuarioModel');
import Post from "./postModel";
import Comentario from "./comentarioModel";

// Post -> Comentario
Post.hasMany(Comentario, { foreignKey: "comentPost" });
Comentario.belongsTo(Post, { foreignKey: "comentPost" });

// Usuario -> Post
Usuario.hasMany(Post, { foreignKey: "postUsuario" });
Post.belongsTo(Usuario, { foreignKey: "postUsuario" });

// Usuario -> Comentario
Usuario.hasMany(Comentario, { foreignKey: "comentUsua" });
Comentario.belongsTo(Usuario, { foreignKey: "comentUsua" });

export default {
    Usuario,
    Post,
    Comentario
};
