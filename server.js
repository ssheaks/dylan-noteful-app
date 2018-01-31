'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');

const notesRouter = require('./router/notes.router');
const {PORT} = require('./config');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.use('/v1', notesRouter);

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
