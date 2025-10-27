const express = require('express');
const methodOverride = require('method-override');
//const Routes = require('./routes/TarefasRoutes');
//const usuarioRoutes = require('./routes/usuarioRoutes');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } 
}));

//app.use(tarefasRoutes);
//app.use(usuarioRoutes);

module.exports = app;
