const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const {PORT = 3000} = process.env;

const {
  status_not_found,
} = require('./utils/constants');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '6354232509ef3153343b6f84'
  };
  next();
});

app.use('/users', users);
app.use('/cards', cardRouter);
app.use('*', function (req, res) {
  res.status(status_not_found).send({
    "message": "Страница не найдена"
  });
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})