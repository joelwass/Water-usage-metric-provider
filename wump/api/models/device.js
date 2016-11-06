/**
 * Created by joelwasserman on 11/5/16.
 */

module.exports = function (sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      field: 'serialNumber',
    },
    user_id: {
      type: DataTypes.STRING,
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'name'
    },
    usageOfDeviceTotal: {
      type: DataTypes.DOUBLE,
      field: 'usageOfDeviceTotal'
    },
    usageOfDeviceToday: {
      type: DataTypes.DOUBLE,
      field: 'usageOfDeviceToday'
    },
  }, {
    classMethods: {
      createNewDevice: function(body) {

        return Device.create(body);
      },

      getAllDevicesForUser: function(body) {

        var params = { where: { user_id: body.user_id }};

        return Device.findAll(params);
      },

      updateDeviceTodayCount: function(body) {

        return Device.update({ usageOfDeviceToday: body.usageOfDeviceToday }, { where: { serialNumber: body.serialNumber }});
      },

      updateDeviceAllTimeCount: function(body) {
        return Device.update({ usageOfDeviceTotal: body.usageOfDeviceTotal }, { where: { serialNumber: body.serialNumber }});
      },

      deleteDeviceById: function(body) {

        var params = { where: { id: body.id }};
        return Device.destroy(params);
      }
    },
    instanceMethods: {

    },
    indexes: [

    ]
  });

  return Device;
};