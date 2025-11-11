const Sequelize = require('sequelize');
const sequelize = new Sequelize('blog_web', 'root', 'biA@2008', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306
});

sequelize.authenticate()
 .then(() => console.log('Conectado ao MySQL com Sequelize!'))

 .catch(err => console.error('Erro ao conectar:', err));
module.exports = sequelize;