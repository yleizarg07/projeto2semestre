const Sequelize= require("sequelize");
const database = require("./db");
//Tabela de comentarios
const Comentario = database.define('Comentario', {
    idComentario: {
        type: Sequelize.INTEGER,
        autoincrement : true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequelize.STRING(280),
        allowNull: false
    },
   comentPost: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'Post',
        key: 'idPost'
    }
  },
    comentUsua: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'Usuario',
        key: 'idUsuario'
    }
  },
});
module.exports = Comentario;
