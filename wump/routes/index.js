var express = require('express');
var router = express.Router();
var controllers = require('../api/controllers');
var middleware = require('./middleware');

/* GET splash page. */
router.get('/', function(req, res, next) {
  res.render('splash', { title: 'WUMP (Water Usage Metric Provider)' });
});

router.route('/api/v1/user/')
  .post(controllers.user.createUser)
  .delete(controllers.user.deleteUser);

router.route('/api/v1/login/')
  .post(controllers.user.login);

router.route('/api/v1/device/')
  .post(controllers.device.createDevice)
  .get(controllers.device.getAllDevices)
  .delete(controllers.device.deleteDevice);

router.route('/api/v1/device/transaction/')
  .post(controllers.device.addDeviceTransaction)
  .delete(controllers.device.deleteTransactionFromDevice);

router.route('/api/v1/device/today/:serialNumber')
  .get(controllers.device.getTodayDataAmountDevice);

router.route('/api/v1/device/history/:serialNumber')
  .get(controllers.device.getDeviceAmountHistory);

module.exports = router;
