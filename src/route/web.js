import express from "express";
import userController from "../controllers/userController"
import deviceController from "../controllers/deviceController"
import roomControler from "../controllers/roomControler";
import sensorControler from "../controllers/sensorController";
import verifyUSer from "../controllers/verifyUser";
import notifycationController from "../controllers/notifycationController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/create-new-company", userController.handleCreateNewCompany);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/user/:id/verify/:token/", userController.handleVerifyEmail);
  router.get("/api/list-company", userController.handleGetListCompany);
  router.post("/api/confirm-company", userController.handleConfirmCompany);
  router.post("/api/send-email-warning", userController.handleSendEmailWarning);
  router.get("/api/allcode/", userController.handeGetAllCode);
  router.get("/api/get-detail-user-by-id", userController.getDetailUserById);
  router.get("/api/get-all-users-by-company", userController.getAllUserByCompany);
  router.post("/api/confirm-by-company", userController.handleConfirmUserByCompany);

  router.post("/api/create-notifycation", notifycationController.createNewNotifycation);
  router.get("/api/get-notifycation", notifycationController.getNotifycationByUserId);
  router.post("/api/send-notifications-warning", notifycationController.sendNotificationsWarning);

  router.post("/api/create-new-room", roomControler.createNewRoom);
  router.get("/api/get-all-room/", roomControler.getAllRoom);
  router.get("/api/get-detail-room-by-id", roomControler.getDetailRoomById);
  router.post("/api/update-info-room", roomControler.updateInfoRoom);
  router.post("/api/delete-room", roomControler.deleteRoom);

  router.get("/api/get-value-sensor-by-date", sensorControler.getValueSensorByTime);
  router.post("/api/post-data-esp32", sensorControler.handlePostDataFromEsp32);
  router.get("/api/get-value-threshold", sensorControler.getValueThreshold);
  router.post("/api/update-value-threshold", sensorControler.updateValueThreshold);

  router.get("/api/get-device-in-room", deviceController.getAllDeviceInRoom);
  router.get("/api/get-all-device", deviceController.getAllDeviceByCompany);
  router.put("/api/update-device", deviceController.handleUpdateDevice);
  router.post("/api/create-new-device", deviceController.handleCreateNewDevice);
  router.delete("/api/delete-device", deviceController.handleDeleteDevice);
  router.get("/api/get-status-device", deviceController.handleGetStatusDevice);
  router.post("/api/create-new-status-device", deviceController.handleCreateNewStatusDevice);

  return app.use("/", router);
};

module.exports = initWebRoutes;