'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(models.Room, { foreignKey: "roomId", targetKey: "id" });
      User.belongsTo(models.Allcode, {
        foreignKey: "typeDevice",
        targetKey: "keyMap",
        as: "typeDeviceData",
      });
      // Device.hasOne(models.statusDevice,{foreignKey: 'deviceId'})
    }
  }
  Device.init(
    {
      deviceName: DataTypes.STRING,
      typeDevice: DataTypes.STRING,
      roomId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Device",
    }
  );
  return Device;
};