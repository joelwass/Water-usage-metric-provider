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
      type: DataTypes.INTEGER,
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

    },
    instanceMethods: {

    },
    indexes: [

    ]
  });

  return Device;
};