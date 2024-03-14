import express from "express";
import userController from "../controllers/userController"
import deviceController from "../controllers/deviceController"
import roomControler from "../controllers/roomControler";
import sensorControler from "../controllers/sensorController";
import notifycationController from "../controllers/notifycationController";
import { refreshToken } from "../middleware";
const verifyToken = require("../middleware/verifyToken");
let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", verifyToken.adminSym_admin(), userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/create-new-company", userController.handleCreateNewCompany);
  router.put("/api/edit-infor-user", verifyToken.userFull(), userController.handleEditInforUser);
  router.put("/api/change-password", verifyToken.userFull(), userController.handleChangePassWord);
  router.delete("/api/delete-user", verifyToken.adminSym_admin(), userController.handleDeleteUser);
  router.put("/api/update-role-user", verifyToken.adminSym(), userController.handleUpdateRoleUser);
  router.post("/api/update-avatar-user", verifyToken.userFull(), userController.handleUpdateImageAvatar);
  router.get("/api/user/:id/verify/:token/", userController.handleVerifyEmail);
  router.get("/api/list-company", userController.handleGetListCompany);
  router.post("/api/confirm-company", verifyToken.adminSym(), userController.handleConfirmCompany);
  router.post("/api/send-email-warning", userController.handleSendEmailWarning);
  router.get("/api/allcode/", userController.handeGetAllCode);
  router.get("/api/get-detail-user-by-id", verifyToken.userFull(), userController.getDetailUserById);
  router.get("/api/get-all-users-by-company", verifyToken.admin(), userController.getAllUserByCompany);
  router.post("/api/confirm-by-company", verifyToken.admin(), userController.handleConfirmUserByCompany);

  router.post("/api/create-notifycation", notifycationController.createNewNotifycation);
  router.get("/api/get-notifycation", verifyToken.userFull(), notifycationController.getNotifycationByUserId);
  router.post("/api/send-notifications-warning", notifycationController.sendNotificationsWarning);

  router.post("/api/create-new-room", verifyToken.admin(), roomControler.createNewRoom);
  router.get("/api/get-all-room/", verifyToken.userFull(), roomControler.getAllRoom);
  router.get("/api/get-detail-room-by-id", verifyToken.userFull(), roomControler.getDetailRoomById);
  router.post("/api/update-info-room", verifyToken.admin(), roomControler.updateInfoRoom);
  router.post("/api/delete-room", verifyToken.admin(), roomControler.deleteRoom);

  router.get("/api/get-value-sensor-by-date", verifyToken.userFull(), sensorControler.getValueSensorByTime);
  router.post("/api/post-data-esp32", sensorControler.handlePostDataFromEsp32);
  router.get("/api/get-value-threshold", verifyToken.userFull(), sensorControler.getValueThreshold);
  router.post("/api/update-value-threshold", verifyToken.admin(), sensorControler.updateValueThreshold);

  router.get("/api/get-device-in-room", verifyToken.userFull(), deviceController.getAllDeviceInRoom);
  router.get("/api/get-all-device", verifyToken.userFull(), deviceController.getAllDeviceByCompany);
  router.put("/api/update-device", verifyToken.admin(), deviceController.handleUpdateDevice);
  router.post("/api/create-new-device", verifyToken.admin(), deviceController.handleCreateNewDevice);
  router.delete("/api/delete-device", verifyToken.admin(), deviceController.handleDeleteDevice);
  router.get("/api/get-status-device", verifyToken.userFull(), deviceController.handleGetStatusDevice);
  router.post("/api/create-new-status-device", deviceController.handleCreateNewStatusDevice);

  router.post("/api/refresh-token", refreshToken);

  return app.use("/", router);
};

module.exports = initWebRoutes;