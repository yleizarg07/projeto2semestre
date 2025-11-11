const app = require('./src/app');
const sequelize = require('./src/config/db');


const PORTA = process.env.PORT || 3000;
sequelize.sync().then(() => {
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
});
import Usuario from './src/config/usuariodb.js';
const all = await Usuario.findAll();
console.log(all);