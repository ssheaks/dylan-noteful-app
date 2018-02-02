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
        console.log(res.body);
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
