"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Threshold_value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Threshold_value.init(
    {
      roomId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      Type_sensor: DataTypes.STRING,
      valueUp: DataTypes.STRING,
      valueDown: DataTypes.STRING,
      unit: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Threshold_value",
    }
  );
  return Threshold_value;
};
