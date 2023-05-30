import db from "../models/index";
const { Op } = require("sequelize");
let createNewNotifycation = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(inputData);
      if (!inputData.userId || !inputData.companyId || !inputData.content || !inputData.type || !inputData.time || !inputData.access_rights) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        await db.Notifycation.create({
          userId: inputData.userId,
          companyId: inputData.companyId,
          content: inputData.content,
          type: inputData.type,
          time: inputData.time,
          access_rights: inputData.access_rights,
          isRead: false,
        });
        resolve({
          errCode: 0,
          message: "Create new Notifycation succeed",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getNotifycationByUserId = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.userId || !inputData.companyId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: inputData.userId },
          attributes: ["roleID"],
        });
        if (user) {
          let data;
          data = await db.Notifycation.findAll({
            where: {
              companyId: inputData.companyId,
              [Op.or]: [{ access_rights: "ALL" }, { access_rights: user.roleID }, { userId: inputData.userId }],
            },
            attributes: {
              exclude: ["access_rights", "createdAt", "updatedAt"],
            },
          });
          resolve({
            errCode: 0,
            message: "Ok",
            data: data,
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  createNewNotifycation: createNewNotifycation,
  getNotifycationByUserId: getNotifycationByUserId,
};
