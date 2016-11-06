/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

  /**
   * @swagger
   * definition:
   *   DeviceObject:
   *     properties:
   *       id:
   *         type: string
   *       user_id:
   *         type: string
   *       name:
   *         type: string
   *       usageOfDeviceTotal:
   *         type: double
   *       usageOfDeviceToday:
   *         type: double
   */

  /**
   * @swagger
   * /device:
   *   post:
   *     tags:
   *       - Device
   *     description: This endpoint is used to create a device for a user
   *       <table>
   *       </table>
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *     - name: body
   *       description: The user id and name for the device
   *       in: body
   *       schema:
   *         properties:
   *           user_id:
   *             type: string
   *             required: true
   *           name:
   *             type: string
   *             required: true
   *         required:
   *           - user_id
   *           - name
   *     responses:
   *       200:
   *         description: Returns the devices for a user
   *         schema:
   *           properties:
   *             success:
   *               type: boolean
   *             result:
   *               $ref: '#/definitions/DeviceObject'
   *       400:
   *         description: An error occured that we are aware of, and we
   *           return a reason for the error that can be fixed
   *         schema:
   *           $ref: '#/definitions/error400ReturnDescription'
   *       500:
   *         description: Something we aren't aware of went wrong with our
   *           server
   *         schema:
   *           $ref: '#/definitions/error400ReturnDescription'
   */

  createDevice: function (req, res, next) {

    console.log(req.body);
    var body = _.pick(req.body, ['user_id', 'name', 'serialNumber']);
    if (_.keys(body).length != 3
      || (typeof body.user_id != 'string')
      || (typeof body.name != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    body.usageOfDeviceToday = 0.0;
    body.usageOfDeviceTotal = 0.0;

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

  /**
   * @swagger
   * /device:
   *   get:
   *     tags:
   *       - Device
   *     description: This endpoint is used to get devices for a user
   *       <table>
   *       </table>
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *     - name: body
   *       description: the user id associated with the devices
   *       in: body
   *       schema:
   *         properties:
   *           user_id:
   *             type: string
   *             required: true
   *         required:
   *           - user_id
   *     responses:
   *       200:
   *         description: Returns success with an array of devices
   *         schema:
   *           properties:
   *             success:
   *               type: boolean
   *             results:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/DeviceObject'
   *       400:
   *         description: An error occured that we are aware of, and we
   *           return a reason for the error that can be fixed
   *         schema:
   *           $ref: '#/definitions/error400ReturnDescription'
   *       500:
   *         description: Something we aren't aware of went wrong with our
   *           server
   *         schema:
   *           $ref: '#/definitions/error400ReturnDescription'
   */

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

  updateDeviceTotal: function (req, res, next) {

    var body = _.pick(req.body, ['serialNumber']);
    if (_.keys(body).length != 1
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Device.updateDeviceAllTimeCount(req.body)
      .then(function (localDevice) {
        return res.status(200).json({ success: true, results: localDevice });
      })
      .catch(function (err) {
        return res.status(400).json({ success: false, message: err });
      });
  },

  updateDeviceToday: function(req, res, next) {
    var body = _.pick(req.body, ['serialNumber']);
    if (_.keys(body).length != 1
      || (typeof body.serialNumber != 'string')
    ) {
      return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
    }

    model.Device.updateDeviceTodayCount(req.body)
      .then(function (localDevice) {
        return res.status(200).json({ success: true, results: localDevice });
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