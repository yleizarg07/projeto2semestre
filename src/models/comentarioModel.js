const Sequelize= require("sequelize");
const database = require("../config/db");
//Tabela de comentarios
const comentario = database.define('comentario', {
    idComentario: {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
   comentPost: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'post',
        key: 'idPost'
    }
  },
    comentUsua: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'usuario',
        key: 'idUsuario'
    }
  },
},
{   
     freezeTableName: true,
    timestamps: false
});
module.exports = comentario;
