'use strict';
const express = require('express');

const data = require('./db/notes');
const {PORT} = require('./config');
const {simpleLogger} = require('./logger-middleware');

// console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...

const app = express();

app.use(express.static('public'));
app.use(simpleLogger);

app.get('/v1/notes', (req, res) => {
  let {searchTerm} = req.query;
  res.json(searchTerm ? data.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())) : data);
});

app.get('/v1/notes/:id', (req, res) => { 
  const item = data.find(item => item.id === parseInt(req.params.id));
  res.json(item);
});

app.get('/foo', (req, res, next) => {
  throw new Error('foo');
});

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
})
  .on('error', err => {
    console.error(err);
  });
