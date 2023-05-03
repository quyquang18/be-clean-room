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
    let response = await roomService.getAllRoom(+req.query.userId);
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

module.exports = {
  createNewRoom: createNewRoom,
  getAllRoom: getAllRoom,
  getDetailRoomById: getDetailRoomById,
};
