const Sequelize = require("sequelize");
const database = require('../config/db');

// Tabela do usuario
const usuario = database.define('usuario', {
    idUsuario: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    nome_usuario: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(286),
        allowNull: false,
    },
    quanti_post: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    relacionamento: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    aniversario: {
        type: Sequelize.DATE,
        allowNull: true
    },
    idade: {
        type: Sequelize.INTEGER(3),
        allowNull: true
    },
    interesses: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    hobbies: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    estilo: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    animaisEstimacao: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    paixoes: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    humor: {
        type: Sequelize.STRING(100),
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
    
});

module.exports = usuario;
