"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifycation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notifycation.init(
    {
      userId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
      time: DataTypes.BIGINT,
      access_rights: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "Notifycation",
      freezeTableName: true,
    }
  );
  return Notifycation;
};
