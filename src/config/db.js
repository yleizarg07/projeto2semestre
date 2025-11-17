const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('mysql://usuario:senha@host:port/nome_do_banco',
  {
    dialect: 'mysql'
  }
);

sequelize.authenticate()
 .then(() => console.log('Conectado ao MySQL com Sequelize!'))

 .catch(err => console.error('Erro ao conectar:', err));
module.exports = sequelize;