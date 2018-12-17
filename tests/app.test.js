const Promise = require('bluebird');
const request = require('supertest');
const localmongoose = require('mongoose');

localmongoose.Promise = Promise;

const app = require('../app');
const User = require('../models/user.js');


describe('Testataan MongoDB-yhteys', () => {
    test('Testataan yhteys', (done) => {
      localmongoose.connect('mongodb://localhost:27017').then(() => {
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
        // Assert other desired stuff
        done();
      });
    });
    // An exercise to the reader: How to validate the JSON structure?
    // See https://www.npmjs.com/package/supertest and promises
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
    // An exercise to the reader: How to validate the JSON structure?
    // See https://www.npmjs.com/package/supertest and promises
  });

