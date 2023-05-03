import deviceService from '../services/deviceService'

const getAllDeviceInRoom = async (req, res) => {
  try {
    let info = await deviceService.getAllDeviceInRoom(req.query);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
const getAllDeviceByUser = async (req, res) => {
  try {
    let info = await deviceService.getAllDeviceByUser(req.query.userId);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
const handleUpdateDevice = async (req, res) => {
  let data = req.body;
  try {
    let info = await deviceService.updateDevice(data);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
const handleCreateNewDevice = async (req, res) => {
  let data = req.body;
  try {
    let info = await deviceService.createNewDevice(data);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
const handleGetLocation = async (req, res) => {
  let userId = req.query.id;
  try {
    let info = await deviceService.getLocation(userId);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
let handleDeleteDevice = async (req, res) => {
  if (!req.query.id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }
  let message = await deviceService.deleteDevice(req.query.id);
  return res.status(200).json(message);
};
const handleGetStatusDevice = async (req, res) => {
  let data = req.query;
  try {
    let info = await deviceService.getStatusDevice(data);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
const handleCreateNewStatusDevice = async (req, res) => {
  let data = req.body;
  try {
    let info = await deviceService.createNewStatusDevice(data);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
module.exports = {
  getAllDeviceInRoom: getAllDeviceInRoom,
  handleUpdateDevice: handleUpdateDevice,
  handleCreateNewDevice: handleCreateNewDevice,
  handleGetLocation: handleGetLocation,
  handleDeleteDevice: handleDeleteDevice,
  handleGetStatusDevice: handleGetStatusDevice,
  handleCreateNewStatusDevice: handleCreateNewStatusDevice,
  getAllDeviceByUser: getAllDeviceByUser,
};