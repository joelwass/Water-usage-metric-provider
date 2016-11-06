/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

  createDevice: function (req, res, next) {

    console.log(req.body);
    var body = _.pick(req.body, ['user_id', 'name', 'serialNumber']);
    if (_.keys(body).length != 3
      || (typeof body.user_id != 'string')
      || (typeof body.name != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Device.createNewDevice(body)
      .then(function (localDevice) {

        return res.status(200).json({ success: true,
            results: localDevice.toJSON()
          });

      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  getAllDevices: function (req, res, next) {

    var body = _.pick(req.body, ['user_id']);
    if (_.keys(body).length != 1
      || (typeof body.user_id != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Device.getAllDevicesForUser(body)
      .then(function (localDevices) {
        return res.status(200).json({ success: true, results: localDevices });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  addDeviceTransaction: function(req, res, next) {
    var body = _.pick(req.body, ['serialNumber', 'timestamp', 'amount']);
    if (_.keys(body).length != 3
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    var newBody = {
      serialNumber: body.serialNumber,
      dateString: new Date(body.timestamp).toDateString(),
      amount: body.amount,
    };

    model.Transaction.createNewTransaction(newBody)
      .then(function (localTransaction) {
        return res.status(200).json({ success: true, results: localTransaction });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  deleteTransactionFromDevice: function(req, res, next) {
    var body = _.pick(req.body, ['serialNumber']);
    if (_.keys(body).length != 1
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Transaction.deleteTransactionBySerialNumber(body)
      .then(function () {
        return res.status(200).json({ success: true });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  getDeviceAmountHistory: function(req, res, next) {
    var body = _.pick(req.params, ['serialNumber']);
    if (_.keys(body).length != 1
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Transaction.getHistoricalData(body)
      .then(function (localHistory) {
        var newResults = [];
        var currentIndex = 0;
        localHistory.forEach(function(currentValue, index, arr) {
          if (index == 0) {
            newResults = [{
              dateString: localHistory[0].dataValues.dateString,
              amount: localHistory[0].dataValues.amount,
            }];
          } else {
            if (currentValue.dateString == newResults[currentIndex].dateString) {
              newResults[currentIndex].amount += currentValue.amount;
            } else {
              var newobject = {
                dateString: localHistory[index].dataValues.dateString,
                amount: localHistory[index].dataValues.amount
              };
              newResults.push(newobject);
            }
          }
          if (index+1 == arr.length) {
            return res.status(200).json({ success: true, results: newResults });
          }
        });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  getTodayDataAmountDevice: function(req, res, next) {
    var body = _.pick(req.params, ['serialNumber']);
    if (_.keys(body).length != 1
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Transaction.getTodayDataAmount(body)
      .then(function (localToday) {
        return res.status(200).json({ success: true, results: localToday });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  deleteDevice: function (req, res, next) {

    var body = _.pick(req.body, ['id']);
    if (_.keys(body).length != 1
      || (typeof body.id != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Device.deleteDeviceById(body)
      .then(function () {
        return res.status(200).json({ success: true });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },
};