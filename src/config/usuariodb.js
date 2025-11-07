const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    nome_usuario: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(286),
        allowNull: true
    },
    quanti_post: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "usuario",
    timestamps: false
});

module.exports = Usuario;
