'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const {PORT} = require('./config');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.get('/v1/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.get('/v1/notes/:id', (req, res, next) => { 
  const id = req.params.id;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      res.json({message: 'not found'});
    }
  }); 
});

app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObject = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObject[field] = req.body[field];
    }
  });

  notes.update(id, updateObject, (err, item) => {
    if (err) { 
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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
