const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT=3000 } = process.env;
const DocumentNotFound = require('./error.js');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '6354232509ef3153343b6f84'
  };
  next();
});

app.use('/', users);
app.use('/', cardRouter);
app.use ('*', function (req,res) {
  res.status(404).send({
    "message" : "Страница не найдена"
  });
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})