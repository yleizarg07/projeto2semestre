const mysql = require('mysql2');
const connection = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'biA@2008',
 database: 'blog_bd'
});
connection.connect((err) => {
 if (err) {
 console.error('Erro ao conectar no MySQL:', err);
 return;
 }
 console.log('Conectado ao MySQL com sucesso!');
});
module.exports = connection;