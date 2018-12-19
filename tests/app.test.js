const Promise = require('bluebird');
const request = require('supertest');
const localmongoose = require('mongoose');
const config = require('../config/database');

localmongoose.Promise = Promise;

const app = require('../app');
const User = require('../models/user.js');


describe('Testataan MongoDB-yhteys', () => {    //testataan mongoose-yhteys
    test('Testataan yhteys', (done) => {
      localmongoose.connect(config.url).then(() => {
        expect(localmongoose.connection.readyState).toBe(1);
      });
      localmongoose.disconnect();
      done(); // eslint-disable-line no-undef
    });
  });


describe('Testataan kirjautumissivu', () => {   
    test('Get-request rootiin', (done) => {
      request(app).get('/').set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        
        done();
      });
    });
    
  });

  describe('Testataan tulossivu', () => {
    test('Get-request data/all', (done) => {
      request(app).get('/data/all').set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        // Assert other desired stuff
        done();
      });
    });
  
  });

  describe('Testataan quiz-router', () => {
    test('Get-request /quiz', (done) => {
      request(app).get('/quiz').set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        // Assert other desired stuff
        done();
      });
    });
  
  });

