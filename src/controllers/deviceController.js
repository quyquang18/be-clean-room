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
const getAllDeviceByCompany = async (req, res) => {
  try {
    let info = await deviceService.getAllDeviceByCompany(req.query.companyId);
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
  console.log("query:", req.query);
  console.log("params:", req.params);
  console.log("body:", req.body);
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
  handleDeleteDevice: handleDeleteDevice,
  handleGetStatusDevice: handleGetStatusDevice,
  handleCreateNewStatusDevice: handleCreateNewStatusDevice,
  getAllDeviceByCompany: getAllDeviceByCompany,
};