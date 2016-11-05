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

        var params = { where: { 'user_id': body.user_id }};

        return Device.findAll(params);
      },

      updateDeviceById: function(body) {

        var device = Device.find({ where: { 'id': body.id }});
        return device.save(body);
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