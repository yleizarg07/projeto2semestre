const app = require('./src/app');
const sequelize = require('./src/config/db');


const PORTA = process.env.PORT || 3000;
const Usuario = require('./src/models/usuarioModel.js');

sequelize.sync().then(async () => {

    const all = await Usuario.findAll();
    console.log(all);

    app.listen(PORTA, () => {
        console.log(`Servidor rodando na porta ${PORTA}`);
    });

}).catch(err => {
    console.error("Erro ao sincronizar com o banco:", err);
});
