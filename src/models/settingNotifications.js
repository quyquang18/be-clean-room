"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class settingNotifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  settingNotifications.init(
    {
      companyId: DataTypes.INTEGER,
      timeDelay: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "settingNotifications",
      freezeTableName: true,
    }
  );
  return settingNotifications;
};
