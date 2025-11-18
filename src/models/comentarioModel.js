const Sequelize= require("sequelize");
const database = require("../config/db");
//Tabela de comentarios
const Comentario = database.define('Comentario', {
    idComentario: {
        type: Sequelize.INTEGER,
        autoIncrement : true,
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
        model: 'Postagem',
        key: 'idPost'
    }
  },
    comentUsua: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'usuario',
        key: 'idUsuario'
    }
  },
},
{   
    tableName: 'Comentario', 
    timestamps: false
});
module.exports = Comentario;
