/**
 * Created by joelwasserman on 11/5/16.
 */
'use strict'

var request = require('supertest');
var should = require('should');
var server = require('../app.js');


describe('User', function () {

  before(function (done) {
    done();
  });

  var userEmail = 'joel@test.com';
  var userPassword = 'testPass';
  var userFirstName = 'joel';
  var userLastName = 'wasserman';
  var auth;

  it('should create user', function (done) {

    var reqBody = {
      email: userEmail,
      password: userPassword,
      firstName: userFirstName,
      lastName: userLastName,
    };

    request(server)
      .post('/api/v1/user')
      .expect('Content-Type', /json/)
      .send(reqBody)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        res.status.should.equal(200);
        json.success.should.equal(true);
        json.results.email.should.equal(userEmail);
        done();
      });

  });

  it('should not create user b/c bad params', function (done) {

    // params missing outside key
    var reqBody = {
      email: userEmail,
    };

    request(server)
      .post('/api/v1/user')
      .expect('Content-Type', /json/)
      .send(reqBody)
      .end(function (err, res) {
        res.status.should.equal(400);
        var json = JSON.parse(res.text);
        json.success.should.equal(false);
        done();
      });

  });

  it('should login user', function (done) {

    var reqBody = {
      email: userEmail,
      password: userPassword,
    };

    request(server)
      .post('/api/v1/login')
      .expect('Content-Type', /json/)
      .send(reqBody)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        res.status.should.equal(200);
        json.success.should.equal(true);
        auth = res.headers.auth;
        should.exist(auth);
        done();
      });

  });

  it('should not login user', function (done) {

    var reqBody = {
      email: userEmail,
      password: 'badPassword',
    };

    request(server)
      .post('/api/v1/login')
      .expect('Content-Type', /json/)
      .send(reqBody)
      .end(function (err, res) {
        res.status.should.equal(400);
        var json = JSON.parse(res.text);
        json.success.should.equal(false);
        done();
      });

  });

  it('should delete user', function (done) {

    var reqBody = {
      email: userEmail,
      password: userPassword,
    };

    request(server)
      .delete('/api/v1/user')
      .expect('Content-Type', /json/)
      .send(reqBody)
      .end(function (err, res) {
        res.status.should.equal(200);
        var json = JSON.parse(res.text);
        json.success.should.equal(true);
        done();
      });

  });

});

