const Sequelize= require("sequelize");
const database = require("../config/db");
//Tabela da postagem
const Post = database.define('Postagem', {
    idPost: {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    conteudo: {
        type: Sequelize.STRING(280),
        allowNull: false
    },
   postUsuario: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unsigned: true,
    references: {
        model: 'Usuario',
        key: 'idUsuario'
    }
  },
    categoria: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
 
});
module.exports = Post;
//Funções geradas pelo vs code(vou fazer ajustes depois)

