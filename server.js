'use strict';
const express = require('express');

const data = require('./db/notes');

// console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...

const app = express();

app.use(express.static('public'));

app.get('/v1/notes', (req, res) => {
  let {searchTerm} = req.query;
  if (searchTerm) {
    searchTerm.toLowerCase();
    res.json(data.filter((item) => item.title.toLowerCase().includes(searchTerm)));
  } else {
    res.json(data);
  }
  
});

app.get('/v1/notes/:id', (req, res) => { 
  const item = data.find(item => item.id === parseInt(req.params.id));
  res.json(item);
});

app
  .listen(8080, function() {
    console.info(`Server listening on ${this.address().port}`);
  })
  .on('error', err => {
    console.error(err);
  });
