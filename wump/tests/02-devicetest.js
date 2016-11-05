/**
 * Created by joelwasserman on 11/5/16.
 */
'use strict'

var request = require('supertest');
var should = require('should');
var _ = require('lodash');
var uuid = require('node-uuid');
var server = require('../app.js');

describe('Device', function () {

  before((done) => {
    done();
  });

  var device = {
    name: 'first device',
    usageOfDeviceToday: 1.0,
    usageOfDeviceTotal: 2.0,
  };

  var userEmail = 'joel@test.com';
  var userPassword = 'testPass';
  var userFirstName = 'joel';
  var userLastName = 'wasserman';

  var deviceId = "";
  var userId = "";

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
        res.status.should.equal(200);
        var json = JSON.parse(res.text);
        json.success.should.equal(true);
        json.results.email.should.equal(userEmail);
        device.user_id = json.results.id;
        userId = json.results.id;
        done();
      });

  });

  it('should create device', function (done) {

    request(server)
      .post('/api/v1/device/')
      .expect('Content-Type', /json/)
      .send(device)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        console.log(json);
        res.status.should.equal(200);
        json.success.should.equal(true);
        deviceId = json.results.id;
        done();
      });

  });

  it('should update device', function (done) {

    const newDevice = {
      id: deviceId,
      usageOfDeviceTotal: 3.0,
    };

    request(server)
      .put('/api/v1/device/')
      .expect('Content-Type', /json/)
      .send(newDevice)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        console.log(json);
        res.status.should.equal(200);
        json.success.should.equal(true);
        json.results.usageOfDeviceTotal.should.equal(3.0);
        done();
      });

  });

  it('should get all devices for user', function (done) {

    var body = {
      user_id: userId,
    };

    request(server)
      .get('/api/v1/device/')
      .expect('Content-Type', /json/)
      .send(body)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        console.log(json);
        res.status.should.equal(200);
        json.success.should.equal(true);
        done();
      });

  });

  it('should delete device', function (done) {

    var body = {
      id: deviceId,
    };

    request(server)
      .delete('/api/v1/device/')
      .expect('Content-Type', /json/)
      .send(body)
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        res.status.should.equal(200);
        json.success.should.equal(true);
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
