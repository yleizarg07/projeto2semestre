const Sequelize= require("sequelize");
const database = require("../config/db");
//Tabela da postagem
const Post = database.define('post', {
    idPost: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    conteudo: {
        type: Sequelize.STRING(280),
        allowNull: false
    },
   postUsuario: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'usuario',
        key: 'idUsuario'
    }
  },
    categoria: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
},
{    freezeTableName: true,
    timestamps: false
});
module.exports = Post;

