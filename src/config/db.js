const Sequelize = require('sequelize');
const sequelize = new Sequelize('blog_bd', 'root', 'biA@2008', {
    dialect: 'mysql',
    host: 'Projeto_PW',
    port: 3306
});

module.exports = sequelize;