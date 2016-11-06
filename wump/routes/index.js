var express = require('express');
var router = express.Router();
var controllers = require('../api/controllers');
var middleware = require('./middleware');

/* GET splash page. */
router.get('/', function(req, res, next) {
  res.render('splash', { title: 'WUMP (Water Usage Metric Provider)' });
});

/* User routes */
router.route('/api/v1/user/')
  .post(controllers.user.createUser)
  .delete(controllers.user.deleteUser);

router.route('/api/v1/login/')
  .post(controllers.user.login);

router.route('/api/v1/device/')
  .post(controllers.device.createDevice)
  .get(controllers.device.getAllDevices)
  .delete(controllers.device.deleteDevice);

router.route('/api/v1/device/total/increment/')
  .post(controllers.device.updateDeviceTotal);

router.route('/api/v1/device/today/increment/')
  .post(controllers.device.updateDeviceToday);

module.exports = router;
