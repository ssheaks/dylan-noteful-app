'use strict';

const coinFlip = (delay) => {
  return new Promise((resolve, reject) => {
    const rand = Boolean(Math.round(Math.random()));
    setTimeout(() => {
      if (rand) {
        resolve('Heads');
      } else {
        reject('Tails');
      }
    }, delay);
  });
};

// coinFlip(100)
//   .then(res => {
//     console.log(1, res);
//     return coinFlip(100);
//   })
//   .then(res => {
//     console.log(2, res);
//     return coinFlip(100);
//   })
//   .then(res => {
//     console.log(3, res);
//     return 'You win';
//   })
//   .then(res => {
//     console.log(4, res);    
//   })
//   .catch(err => console.log(err));

const coin1 = coinFlip(100).catch(err => err);
const coin2 = coinFlip(200).catch(err => err);
const coin3 = coinFlip(300).catch(err => err);

Promise.all( [coin1, coin2, coin3])
  .then(arrayOfResults => {
    console.log(arrayOfResults);
  })
  .catch(err => {
    console.error(err);
  });