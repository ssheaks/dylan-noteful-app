'use strict';

const simpleLogger = (req, res, next) => {
  let path = req.path;
  let method = req.method;
  let now = new Date();
  let time = now.toLocaleTimeString();
  let date = now.toLocaleDateString();
  console.log(date, time, method, path);
  next();
};

module.exports = {simpleLogger};