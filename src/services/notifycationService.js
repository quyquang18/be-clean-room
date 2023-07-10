import db from "../models/index";
const { Op } = require("sequelize");
let createNewNotifycation = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.userId ||
        !inputData.companyId ||
        !inputData.content ||
        !inputData.type ||
        !inputData.time ||
        !inputData.access_rights
      ) {
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
        } else {
          resolve({
            errCode: 2,
            message: "user does not exist",
            data: [],
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const sendNotificationsConfirmUser = async (username, companyId) => {
  if (username || companyId) {
    let user = await db.User.findAll({
      where: {
        companyId: companyId,
        roleID: "R2",
      },
      attributes: ["id", "username", "companyId"],
    });
    if (user && user.length > 0) {
      user.forEach(async (element) => {
        let content = `Xin chào ${element.username} tài khoản ${username} vừa đăng kí thuộc công ty của bạn.Vui lòng xác nhận`;
        let time = new Date().getTime();
        await db.Notifycation.create({
          userId: element.id,
          companyId: element.companyId,
          content: content,
          type: "NT0",
          time: time,
          access_rights: "R2",
          isRead: false,
        });
      });
    }
  }
};
const sendNotificationsWellcomeUser = async (username, companyId, userId) => {
  if (username || userId || companyId) {
    let content = `Chào mừng ${username} đến với trang quản lí thiết bị và giám sát phòng sạch của LUXAS. `;
    let time = new Date().getTime();
    await db.Notifycation.create({
      userId: userId,
      companyId: companyId,
      content: content,
      type: "NT0",
      time: time,
      access_rights: "R3",
      isRead: false,
    });
  }
};
const sendNotificationsWarning = async (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.roomId ||
        !inputData.companyId ||
        !inputData.valueCurrent ||
        !inputData.valueUp ||
        !inputData.valueDown ||
        !inputData.typeSensor
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let dataRoom = await db.Room.findOne({
          where: {
            id: inputData.roomId,
          },
          attributes: ["id", "name"],
        });
        console.log(dataRoom);
        if (dataRoom) {
          let content = `Giá trị của ${inputData.typeSensor} trong phòng ${dataRoom.name} là  ${inputData.valueCurrent} nằm ngoài giá trị cho phép (từ ${inputData.valueDown} đến ${inputData.valueUp})`;
          let time = new Date().getTime();
          await db.Notifycation.create({
            userId: inputData.userId || null,
            companyId: inputData.companyId,
            content: content,
            type: "NT1",
            time: time,
            access_rights: "ALL",
            isRead: false,
          });
          resolve({
            errCode: 0,
            message: "Ok",
          });
        } else {
          resolve({
            errCode: 2,
            message: "Room does not exist",
            data: [],
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
  sendNotificationsConfirmUser: sendNotificationsConfirmUser,
  sendNotificationsWellcomeUser: sendNotificationsWellcomeUser,
  sendNotificationsWarning: sendNotificationsWarning,
};
