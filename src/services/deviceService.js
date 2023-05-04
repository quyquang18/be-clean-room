import moment from "moment";
import db from "../models/index";
const { Sequelize, Op } = require("sequelize");
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
      if (!inputData.userId || !inputData.roomId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Device.findAll({
          where: { userId: inputData.userId, roomId: inputData.roomId },
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
const getAllDeviceByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Device.findAll({
          where: { userId: userId },
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
      if (!inputData.userId || !inputData.deviceName || !inputData.typeDevice || !inputData.mode) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        if (inputData.mode === "UPDATE") {
          let [device, created] = await db.Device.findOrCreate({
            where: {
              userId: inputData.userId,
              roomId: inputData.roomId,
              typeDevice: inputData.typeDevice,
              deviceName: inputData.deviceName,
            },
            defaults: {
              userId: inputData.userId,
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
              userId: inputData.userId,
            },
            defaults: {
              name: inputData.roomName,
              userId: inputData.userId,
            },
            raw: true,
          });
          if (createdRoom) {
            let data = await db.Device.create({
              deviceName: inputData.deviceName,
              typeDevice: inputData.typeDevice,
              roomId: room._previousDataValues.id,
              userId: inputData.userId,
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
              userId: inputData.userId,
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

const getLocation = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Location.findAll({
          where: { userId: userId },
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
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
      if (!inputData.userId || !inputData.roomId || !inputData.deviceId || !inputData.date || !inputData.type) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = "";
        if (inputData.type === "month" || inputData.type === "date") {
          const dateObj = moment(new Date(+inputData.date));
          const startTime = dateObj.startOf(inputData.type).valueOf();
          const endTime = dateObj.endOf(inputData.type).valueOf();
          data = await db.statusDevice.findAll({
            where: {
              userId: +inputData.userId,
              roomId: +inputData.roomId,
              deviceId: +inputData.deviceId,
              date: {
                [Op.between]: [startTime, endTime],
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            raw: true,
          });
        }
        if (inputData.type === "range") {
          let inputDate = inputData.date.split(",");
          console.log(inputData.date);
          const startTime = moment(new Date(+inputDate[0])).startOf("date").valueOf();
          const endTime = moment(new Date(+inputDate[1])).endOf("date").valueOf();
          data = await db.statusDevice.findAll({
            where: {
              userId: inputData.userId,
              roomId: inputData.roomId,
              deviceId: inputData.deviceId,
              date: {
                [Op.between]: [startTime, endTime],
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            raw: true,
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
// const countStatusTime = (date, start, end) => {
//   let dateStart = date + " " + start;
//   let dateEnd = date + " " + end;
//   var diff = Math.abs(new Date(dateStart.replace(/-/g, "/")) - new Date(dateEnd.replace(/-/g, "/")));

//   let seconds = diff / 1000;
//   const hours = parseInt(seconds / 3600);
//   seconds = seconds % 3600;
//   const minutes = parseInt(seconds / 60);
//   seconds = seconds % 60;
//   return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
// };
let createNewStatusDevice = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.userId || !inputData.roomId || !inputData.deviceId || !inputData.status || !inputData.date) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        const date = moment(new Date(+inputData.date)).startOf("date").valueOf();
        let check = await db.statusDevice.findOne({
          where: {
            deviceId: +inputData.deviceId,
            roomId: +inputData.roomId,
            userId: +inputData.userId,
            date: date,
            stateEndTime: "0000000000000",
          },
          raw: false,
        });
        console.log(check);
        if (check) {
          if (check.status === inputData.status) {
            check.stateEndTime = inputData.date;
            await check.save();
            resolve({
              errCode: 0,
              message: "update status end time successful 1",
            });
          } else {
            check.stateEndTime = inputData.date;
            await check.save();

            let statusDevice = await db.statusDevice.create({
              deviceId: +inputData.deviceId,
              roomId: +inputData.roomId,
              userId: +inputData.userId,
              status: inputData.status,
              stateStartTime: inputData.date,
              date: date,
              stateEndTime: "0000000000000",
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
            userId: +inputData.userId,
            status: inputData.status,
            stateStartTime: inputData.date,
            date: date,
            stateEndTime: "0000000000000",
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
// const createNewStatusDevice = (inputData) => {
//   return new Promise(async () => {
//     try {
//       if (!inputData.userId || !inputData.roomId || !inputData.deviceId || !inputData.status || !inputData.date) {
//         resolve({
//           errCode: 1,
//           message: "Missing required parameter",
//         });
//       } else {
//         let data = await db.User.findOrCreate({
//           where: {
//             userId: inputData.userId,
//             roomId: inputData.roomId,
//             deviceId: inputData.deviceId,
//             status: inputData.status,
//           },
//           defaults: {
//             userId: inputData.userId,
//             roomId: inputData.roomId,
//             deviceId: inputData.deviceId,
//             stateStartTime: inputData.date,
//           },
//           raw: true,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };
module.exports = {
  getAllDeviceInRoom: getAllDeviceInRoom,
  getAllDeviceByUser: getAllDeviceByUser,
  updateDevice: updateDevice,
  createNewDevice: createNewDevice,
  getLocation: getLocation,
  deleteDevice: deleteDevice,
  getStatusDevice: getStatusDevice,
  createNewStatusDevice: createNewStatusDevice,
};
