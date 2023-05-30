'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      roleID: DataTypes.STRING,
      userVerified: DataTypes.BOOLEAN,
      companyVerified: DataTypes.BOOLEAN,
      gender: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
      image: DataTypes.BLOB("long"),
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};