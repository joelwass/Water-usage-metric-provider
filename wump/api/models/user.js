/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'firstName',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'lastName',
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING,
      field: 'password',
    },
  }, {
    classMethods: {
      addNewUser: function(body) {

        return User.create(body);
      },

      authenticate: function (body) {
        var user;
        var params =  { where:
        { email: body.email, password: body.password },
        };
        return User.findOne(params)
          .then(function (localUser) {
            if (localUser) {
              user = localUser;
              return (body.password == user.password);
            } else {
              return Promise.reject(new Error);
            }
          })
          .then(function (result) {
            if (result) {
              return Promise.resolve(user);
            } else {
              return Promise.reject(new Error);
            }
          })
          .catch(function (err) {
            return Promise.reject(err);
          });
      },

      createAndSaveRefreshToken: function (userId, model) {
        const token = User.createRefreshToken(userId);
        if (token) {
          return model.Token.create({ token: token, userId: userId });
        } else {
          return Promise.reject(new Error);
        }
      },

      createAccessToken: function (userId) {
        return User.createToken(userId, '2h');
      },

      createRefreshToken: function (userId) {
        return User.createToken(userId, '2000d');
      },

      createToken: function (userId, expiration) {

        try {
          var stringData = JSON.stringify({ id: userId, type: 'authentication' });
          var encryptedData = cryptojs.AES.encrypt(stringData,
            process.env.AES_PASSPHRASE).toString();
          var token = jwt.sign({ token: encryptedData },
            process.env.JWT_PASSPHRASE,
            { expiresIn: expiration });
          return token;
        } catch (e) {
          console.error(e);
          return undefined;
        }
      },

      verifyAccessToken: function (token) {
        return new Promise(function (resolve, reject) {
          jwt.verify(token, process.env.JWT_PASSPHRASE, function (err, decoded) {
            if (err) {
              return reject(err);
            }

            resolve(decoded);
          });
        });
      },

      deleteUser: function(body) {

        var params = { where: { email: body.email, password: body.password }};
        return User.destroy(params);
      },

      findByAccessToken: function (decoded) {
        return new Promise(function (resolve, reject) {
          try {
            var bytes = cryptojs.AES.decrypt(decoded.token, process.env.AES_PASSPHRASE);
            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
            User.findById(tokenData.id)
              .then(function (user) {
                if (user) {
                  return resolve(user);
                } else {
                  return reject(new Error);
                }
              })
              .catch(function (err) {
                reject(err);
              });

          } catch (e) {
            reject(e);
          }
        });
      },
    },
    instanceMethods: {


    },
  });

  return User;
};