var express = require('express');
var router = express.Router();

/* GET splash page. */
router.get('/', function(req, res, next) {
  res.render('splash', { title: 'WUMP (Water Usage Metric Provider)' });
});

/* User routes */
router.route('/api/v1/users/')
  .post(controllers.user.createUser)
  .delete(controllers.user.deleteUser);

router.route('/api/v1/login/')
  .post(controllers.user.login);

router.route('/api/v1/device/')
  .post(controllers.device.createDevice)
  .get(controllers.device.getAllDevices)
  .put(controllers.device.updateDevice)
  .delete(controllers.device.deleteDevice);

module.exports = router;
