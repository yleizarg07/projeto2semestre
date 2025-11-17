const express = require('express');
const methodOverride = require('method-override');
const postRoutes = require('./routes/postRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes')
const path = require('path');
const session = require('express-session');

require('./models/associations');
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
  cookie: { secure: false } 
}));

app.get('/', (req, res) => {
    res.redirect('/posts');
});

app.use('/', comentarioRoutes);

app.use('/posts', postRoutes);

app.use('/usuarios', usuarioRoutes);

module.exports = app;
