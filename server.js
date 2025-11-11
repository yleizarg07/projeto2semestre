const app = require('./src/app');

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
import Usuario from './src/config/usuariodb.js';
const all = await Usuario.findAll();
console.log(all);