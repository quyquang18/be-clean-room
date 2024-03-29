'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class statusDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // statusDevice.belongsTo(models.Location,{foreignKey: 'locationID'});
      // statusDevice.belongsTo(models.Device,{foreignKey: 'deviceId'});
    }
  }
  statusDevice.init(
    {
      status: DataTypes.STRING,
      date: DataTypes.BIGINT,
      stateStartTime: DataTypes.BIGINT,
      stateEndTime: DataTypes.BIGINT,
      deviceId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "statusDevice",
    }
  );
  return statusDevice;
};