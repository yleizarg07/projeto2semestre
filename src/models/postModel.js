const Sequelize= require("sequelize");
const database = require("../config/db");
//Tabela da postagem
const Post = database.define('Post', {
    idPost: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING(50),
        allowNull: false
    }
 
});
module.exports = Post;

