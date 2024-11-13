const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users.router.js');
const petsRouter = require('./routes/pets.router.js');
const adoptionsRouter = require('./routes/adoption.router.js');
const sessionsRouter = require('./routes/sessions.router.js');
const mocksRouter = require('./routes/mocks.router.js');

const app = express();

mongoose.connect('mongodb+srv://sjsalvadorit:coderhouse@cluster0.nhcqpqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((error) => console.error('Error al conectar a la base de datos:', error));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

module.exports = app;
