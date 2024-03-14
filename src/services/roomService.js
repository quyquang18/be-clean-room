import db from "../models/index";

let createNewRoom = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.name || !inputData.companyId || !inputData.actions) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        if (inputData.actions === "CREATE") {
          await db.Room.create({
            name: inputData.name,
            companyId: inputData.companyId,
          });
          resolve({
            errCode: 0,
            message: "Create new Room succeed",
          });
        }
        if (inputData.actions === "EDIT") {
          if (inputData.roomId) {
            let data = await db.Room.findOne({
              where: { id: inputData.roomId },
            });
            data.name = inputData.name;
            await data.save();
            resolve({
              errCode: 0,
              message: "Update room succeed",
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
let getAllRoom = (companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let data = await db.Room.findAll({
          where: { companyId: companyId },
          raw: true,
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

let getDetailRoomById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let data = await db.Room.findOne({
          where: {
            id: inputId,
          },
          raw: true,
        });
        if (data) {
          let doctorRoom = await db.Doctor_infor.findAll({
            where: {
              RoomId: inputId,
            },
            attributes: ["doctorId", "provinceId"],
            raw: true,
          });
          data.listDoctor = doctorRoom;
        }
        if (!data) data = {};
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
let updateInfoRoom = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.roomName || !inputData.roomId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let data = await db.Room.findOne({
          where: {
            id: inputData.roomId,
            companyId: inputData.companyId,
          },
          raw: false,
        });
        if (data) {
          let resName = await db.Room.findOne({
            where: {
              name: inputData.roomName,
              companyId: inputData.companyId,
            },
          });
          if (!resName) {
            data.name = inputData.roomName;
            data.save();
            resolve({
              errCode: 0,
              message: "Ok",
            });
          } else {
            resolve({
              errCode: 2,
              message: "Room name already exists",
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
let deleteRoom = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.roomId || !inputData.companyId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let room = await db.Room.findOne({
          where: {
            id: inputData.roomId,
            companyId: inputData.companyId,
          },
        });
        if (!room) {
          resolve({
            errCode: 2,
            message: `The room isn't exist`,
          });
        }
        await db.Room.destroy({
          where: {
            id: inputData.roomId,
            companyId: inputData.companyId,
          },
        });
        resolve({
          errCode: 0,
          message: `The device is deleted`,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getRoomAndCompanybyDeviceId = (deviceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!deviceId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        console.log(deviceId);
        resolve({
          errCode: 0,
          data: deviceId,
          message: "test success",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  createNewRoom: createNewRoom,
  getAllRoom: getAllRoom,
  getDetailRoomById: getDetailRoomById,
  updateInfoRoom: updateInfoRoom,
  deleteRoom: deleteRoom,
  getRoomAndCompanybyDeviceId: getRoomAndCompanybyDeviceId,
};
