import notifycationService from "../services/notifycationService";
let createNewNotifycation = async (req, res) => {
  try {
    let infor = await notifycationService.createNewNotifycation(req.body);
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
    let infor = await notifycationService.getNotifycationByUserId(req.query);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let sendNotificationsWarning = async (req, res) => {
  try {
    let infor = await notifycationService.sendNotificationsWarning(req.body);
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
  sendNotificationsWarning: sendNotificationsWarning,
};
