/**
 * Created by joelwasserman on 11/5/16.
 */

var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

var _ = require('lodash');

var model  = require('../api/models');
var helper  = require('../api/helpers');

module.exports = {
  requireAuthentication: function (req, res, next) {

    var token = req.get('Auth');

    if (_.isUndefined(token)) {
      return res.status(401).json({ success: false, message: helper.strings.InvalidToken });
    }

    var findAccessTokenErr;
    model.User.verifyAccessToken(token)
      .then(function (decoded) {
        return model.User.findByAccessToken(decoded);
      })
      .then(function (user) {
        req.user = user;
      })
      .catch(function (err) {
        findAccessTokenErr = err;
        if (err.name && err.name === 'MyError') {
          return res.status(400).json({ success: false, message: err.message });
        }

        if (err.message && err.message == 'jwt expired') {
          res.status(401).json({ success: false, message: helper.strings.InvalidToken });
        } else if (err.message && err.message == 'invalid signature') {
          res.status(401).json({ success: false, message: helper.strings.InvalidToken });
        } else {
          helper.logging.logError(err, req);
          res.status(500).json({ success: false, message: helper.strings.AnErrorHappened });
        }
      })
      .then(function () {
        if (findAccessTokenErr === undefined) {
          next();
        }
      });
  },
};
