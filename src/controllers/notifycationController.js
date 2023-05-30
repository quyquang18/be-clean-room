import sensorService from "../services/notifycationService";
let createNewNotifycation = async (req, res) => {
  try {
    let infor = await sensorService.createNewNotifycation(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let getNotifycationByUserId = async (req, res) => {
  try {
    let infor = await sensorService.getNotifycationByUserId(req.query);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

module.exports = {
  createNewNotifycation: createNewNotifycation,
  getNotifycationByUserId: getNotifycationByUserId,
};
