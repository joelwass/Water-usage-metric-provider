var express = require('express');
var router = express.Router();
var controllers = require('../api/controllers');
var middleware = require('./middleware');

/* GET splash page. */
router.get('/', function(req, res, next) {
  res.render('splash', { title: 'WUMP (Water Usage Metric Provider)' });
});

/* User routes */

/*
create user
body {
  firstName: string
  lastName: string
  email: string
  password: string
}

 should return success or failure and then the user created
 */

/*
 delete user
 body {
  email: string
  password: string
 }

 should return success or failure
 */
router.route('/api/v1/user/')
  .post(controllers.user.createUser)
  .delete(controllers.user.deleteUser);

/*
login
 body {
 email: string
 password: string
 }

 should return success or failure and then the user loggedin
 */
router.route('/api/v1/login/')
  .post(controllers.user.login);

/*
 create device
 body {
  serialNumber: string (random string)
  user_id: string (id of the user that owns the device
  name: string (name of the device)
 }

 should return success or failure and then the device created
 */

/*
 get all devices
 body {
   user_id: string (id of user to get all devices)
 }

 should return success or failure and then an array of devices
 */

/*
 delete device
 body {
   id: string (device id to be deleted)
 }

 should return success or failure
 */
router.route('/api/v1/device/')
  .post(controllers.device.createDevice)
  .get(controllers.device.getAllDevices)
  .delete(controllers.device.deleteDevice);

/*
update device total
 body {
   serialNumber: string
   usageOfDeviceTotal: double
 }

 should return success or failure and then the updated device
 */
router.route('/api/v1/device/total/increment/')
  .post(controllers.device.updateDeviceTotal);

/*
 update device today
 body {
    serialNumber: string
    usageOfDeviceToday: double
 }

 should return success or failure and then the updated device
 */
router.route('/api/v1/device/today/increment/')
  .post(controllers.device.updateDeviceToday);

module.exports = router;
