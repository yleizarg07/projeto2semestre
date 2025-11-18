const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'PLcqMPtoVkouBbKuoBTFiztiTkGyNcJQ', {
  host: 'nozomi.proxy.rlwy.net',
  port: 38126,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;

sequelize.authenticate()
 .then(() => console.log('Conectado ao MySQL com Sequelize!'))

 .catch(err => console.error('Erro ao conectar:', err));
module.exports = sequelize;