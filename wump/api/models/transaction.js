/**
 * Created by joelwasserman on 11/5/16.
 */

module.exports = function (sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      field: 'serialNumber',
    },
    dateString: {
      type: DataTypes.STRING,
      field: 'dateString'
    },
    amount: {
      type: DataTypes.DOUBLE,
      field: 'amount'
    }
  }, {
    classMethods: {
      createNewTransaction: function(body) {

        return Transaction.create(body);
      },

      getHistoricalData: function(body) {

        var params = { where: { serialNumber: body.serialNumber }};
        return Transaction.findAll(params);
      },

      getTodayDataAmount: function(body) {

        console.log(new Date().toDateString());

        var params = { where: { dateString: new Date().toDateString(), serialNumber: body.serialNumber }};
        return Transaction.findAll(params);
      },

      deleteTransactionBySerialNumber: function(body) {

        var params = { where: { serialNumber: body.serialNumber }};
        return Transaction.destroy(params);
      }
    },
    instanceMethods: {

    },
    indexes: [

    ]
  });

  return Transaction;
};