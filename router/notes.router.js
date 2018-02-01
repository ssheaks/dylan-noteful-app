'use strict';
const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes
    .filter(searchTerm)
    .then(list => {
      if (list) {
        res.json(list);
      } else {
        return next();
      }
    })
    .catch(next);
});

router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes
    .find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.json({ message: 'not found' });
      }
    })
    .catch(next);
});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content };

  if (!newItem.title) {
    const err = new Error('Title must be present');
    err.status = 400;
    next(err);
  }

  notes
    .create(newItem)
    .then(item => {
      if (item) {
        res
          .location(`http://${req.headers.host}/notes/${item.id}`)
          .status(201)
          .json(item);
      } else {
        next();
      }
    })
    .catch(next);
});

router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObject = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObject[field] = req.body[field];
    }
  });

  notes
    .update(id, updateObject)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(next);
});

router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes
    .delete(id)
    .then(length => {
      if (length) {
        res.status(204).end();
      } else {
        res.json({ message: 'not found' });
      }
    })
    .catch(next);
});


module.exports = router;
