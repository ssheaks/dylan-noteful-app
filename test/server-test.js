'use strict';
const app = require('../server');
const chai = require('chai');
const spy = require('chai-spies');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(spy);


describe('Reality check', function() {
  it('true should be true', function() {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function() {
  it('GET request "/" should return the index page', function() {
    return chai
      .request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function() {
  it('should respond with 404 when given a bad path', function() {
    const spy = chai.spy();
    return chai
      .request(app)
      .get('/bad/path')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });
});

describe('api.GET /notes', function() {
  it('should GET a list of notes', function() {
    return chai
      .request(app)
      .get('/v1/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(10);

        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(item => {
          expect(item).to.have.keys(expectedKeys);
        });
      });
  });
});

describe('api.GET /notes/:id', function() {
  it('should return a single note if ID exists in memory', function() {
    const randID = Math.floor(Math.random() * 10) + 1000;
    return chai
      .request(app)
      .get(`/v1/notes/${randID}`)
      .then(function(res) {
        expect(res.body.id).to.equal(randID);
      });
  });

  it('should return an error if note ID does not exist', function() {
    const badID = 10000;
    return chai
      .request(app)
      .get(`/v1/notes/${badID}`)
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
});

describe('api.POST /notes', function() {
  it('should POST a new note with valid inputs', function() {
    let newObject = { title: 'CATS!', content: 'A lot of cats'};

    return chai
      .request(app)
      .post('/v1/notes')
      .send(newObject)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.not.equal('null');
      })
      .then(function(){
        return chai
          .request(app)
          .get('/v1/notes')
          .then(function(res) {
            expect(res.body.length).to.be.eq(11);
          });
      });
  });

  it('should not POST a new note with invalid inputs', function(){
    let newObject = { title: ''};
    return chai
      .request(app)
      .post('/v1/notes')
      .send(newObject)
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });
});

describe('api.PUT', function() {
  it('should PUT an existing object with valid input', function() {
    let updateObject = { title: 'CATSSSS', content: 'CATTASSASF', id: 1000};
    return chai
      .request(app)
      .put('/v1/notes/1000')
      .send(updateObject)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(updateObject);
      })
      .then(function() {
        return chai
          .request(app)
          .get('/v1/notes')
          .then(function(res) {
            expect(res.body.length).to.equal(10);
          });
      });
  });
});
