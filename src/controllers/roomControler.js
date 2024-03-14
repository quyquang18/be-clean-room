import roomService from "../services/roomService";

let createNewRoom = async (req, res) => {
  try {
    let response = await roomService.createNewRoom(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let getAllRoom = async (req, res) => {
  try {
    let response = await roomService.getAllRoom(+req.query.companyId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let getDetailRoomById = async (req, res) => {
  try {
    let response = await roomService.getDetailRoomById(req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let updateInfoRoom = async (req, res) => {
  try {
    let response = await roomService.updateInfoRoom(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let deleteRoom = async (req, res) => {
  try {
    let response = await roomService.deleteRoom(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let getRoomAndCompanybyDeviceId = async (req, res) => {
  try {
    let response = await roomService.getRoomAndCompanybyDeviceId(req.body.deviceId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

module.exports = {
  createNewRoom: createNewRoom,
  getAllRoom: getAllRoom,
  getDetailRoomById: getDetailRoomById,
  updateInfoRoom: updateInfoRoom,
  deleteRoom: deleteRoom,
  getRoomAndCompanybyDeviceId: getRoomAndCompanybyDeviceId,
};
