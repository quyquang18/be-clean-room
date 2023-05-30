'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class valueSensor extends Model {

    static associate(models) {
      // define association here
    }
  };
  valueSensor.init(
    {
      temperature: DataTypes.STRING,
      humidity: DataTypes.STRING,
      dust25: DataTypes.STRING,
      dust10: DataTypes.STRING,
      differPressure: DataTypes.STRING,
      oxy: DataTypes.STRING,
      date: DataTypes.BIGINT,
      roomId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "valueSensor",
    }
  );
  return valueSensor;
};