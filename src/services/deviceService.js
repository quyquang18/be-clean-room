import moment from "moment";
import db from "../models/index";
const { Op } = require("sequelize");
const updateDevice = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.idDevice || !inputData.roomId || !inputData.deviceName || !inputData.typeDevice) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let device = await db.Device.findOne({
          where: { id: inputData.idDevice },
          raw: false,
        });
        if (device) {
          device.deviceName = inputData.deviceName;
          device.typeDevice = inputData.typeDevice;
          device.roomId = inputData.roomId;
          await device.save();
          resolve({
            errCode: 0,
            message: `Update the device succeeds`,
          });
        } else {
          resolve({
            errCode: 1,
            message: `device's not found!`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const getAllDeviceInRoom = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId || !inputData.roomId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Device.findAll({
          where: { companyId: inputData.companyId, roomId: inputData.roomId },
          attributes: ["id", "deviceName"],
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const getAllDeviceByCompany = (companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Device.findAll({
          where: { companyId: companyId },
          include: [
            {
              model: db.Room,
              attributes: ["name"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let createNewDevice = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId || !inputData.deviceName || !inputData.typeDevice || !inputData.mode) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        if (inputData.mode === "UPDATE") {
          let [device, created] = await db.Device.findOrCreate({
            where: {
              companyId: inputData.companyId,
              roomId: inputData.roomId,
              typeDevice: inputData.typeDevice,
              deviceName: inputData.deviceName,
            },
            defaults: {
              companyId: inputData.companyId,
              roomId: inputData.roomId,
              deviceName: inputData.deviceName,
              typeDevice: inputData.typeDevice,
            },
            raw: true,
          });
          if (created) {
            resolve({
              errCode: 0,
              message: "Create New Device Succeed !",
              data: device,
            });
          }
          if (!created) {
            resolve({
              errCode: 2,
              message: "The device already exists in this location. Please try again !",
              data: device,
            });
          }
        }
        if (inputData.mode === "CREATE" && inputData.roomName) {
          let [room, createdRoom] = await db.Room.findOrCreate({
            where: {
              name: inputData.roomName,
              companyId: inputData.companyId,
            },
            defaults: {
              name: inputData.roomName,
              companyId: inputData.companyId,
            },
            raw: true,
          });
          if (createdRoom) {
            let data = await db.Device.create({
              deviceName: inputData.deviceName,
              typeDevice: inputData.typeDevice,
              roomId: room._previousDataValues.id,
              companyId: inputData.companyId,
            });
            resolve({
              errCode: 0,
              data: data,
              message: `device has been added to available location ${room._previousDataValues.id} successfully`,
            });
          } else {
            let data = await db.Device.create({
              deviceName: inputData.deviceName,
              typeDevice: inputData.typeDevice,
              roomId: room.id,
              companyId: inputData.companyId,
            });
            resolve({
              errCode: 0,
              data,
              message: `device has been added to new location ${room.id} successfully`,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let deleteDevice = (deviceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let device = await db.Device.findOne({
        where: { id: deviceId },
      });
      if (!device) {
        resolve({
          errCode: 2,
          message: `The device isn't exist`,
        });
      }
      await db.Device.destroy({
        where: { id: deviceId },
      });
      resolve({
        errCode: 0,
        message: `The device is deleted`,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
const getStatusDevice = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId || !inputData.roomId || !inputData.deviceId || !inputData.date || !inputData.type) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = "";
        if (inputData.type === "month" || inputData.type === "date") {
          const dateObj = moment(new Date(+inputData.date)).utcOffset("+07:00");
          const startTime = dateObj.startOf(inputData.type).valueOf();
          const endTime = dateObj.endOf(inputData.type).valueOf();
          data = await db.statusDevice.findAll({
            where: {
              companyId: +inputData.companyId,
              roomId: +inputData.roomId,
              deviceId: +inputData.deviceId,
              date: {
                [Op.between]: [startTime, endTime],
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            order: [["stateStartTime", "ASC"]],
            raw: true,
          });
        }
        if (inputData.type === "range") {
          let inputDate = inputData.date.split(",");
          const startTime = moment(new Date(+inputDate[0])).utcOffset("+07:00").startOf("date").valueOf();
          const endTime = moment(new Date(+inputDate[1])).utcOffset("+07:00").endOf("date").valueOf();
          data = await db.statusDevice.findAll({
            where: {
              companyId: inputData.companyId,
              roomId: inputData.roomId,
              deviceId: inputData.deviceId,
              date: {
                [Op.between]: [startTime, endTime],
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            order: [["stateStartTime", "ASC"]],
            raw: true,
          });
        }
        if (data && data.length > 0) {
          data.map((item) => {
            if (+item.stateEndTime === 0) {
              item.stateEndTime = "" + new Date().getTime();
            }
          });
        }
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let createNewStatusDevice = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId || !inputData.roomId || !inputData.deviceId || !inputData.status) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let date = moment(new Date()).utcOffset("+07:00").startOf("day").valueOf();
        let time = new Date().getTime();
        let check = await db.statusDevice.findOne({
          where: {
            deviceId: +inputData.deviceId,
            roomId: +inputData.roomId,
            companyId: +inputData.companyId,
            date: date,
            stateEndTime: 0,
          },
          raw: false,
        });
        if (check) {
          if (check.status === inputData.status) {
            check.stateEndTime = time;
            await check.save();
            resolve({
              errCode: 0,
              message: "update status end time successful",
            });
          } else {
            check.stateEndTime = time;
            await check.save();

            let statusDevice = await db.statusDevice.create({
              deviceId: +inputData.deviceId,
              roomId: +inputData.roomId,
              companyId: +inputData.companyId,
              status: inputData.status,
              stateStartTime: time,
              date: date,
              stateEndTime: 0,
            });
            resolve({
              errCode: 0,
              message: "update status end time successful",
            });
          }
        } else {
          await db.statusDevice.create({
            deviceId: +inputData.deviceId,
            roomId: +inputData.roomId,
            companyId: +inputData.companyId,
            status: inputData.status,
            stateStartTime: time,
            date: date,
            stateEndTime: 0,
          });
          resolve({
            errCode: 0,
            message: "Status value update successful",
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
  getAllDeviceInRoom: getAllDeviceInRoom,
  getAllDeviceByCompany: getAllDeviceByCompany,
  updateDevice: updateDevice,
  createNewDevice: createNewDevice,
  deleteDevice: deleteDevice,
  getStatusDevice: getStatusDevice,
  createNewStatusDevice: createNewStatusDevice,
};
