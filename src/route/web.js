import express from "express";
import userController from "../controllers/userController"
import deviceController from "../controllers/deviceController"
import roomControler from "../controllers/roomControler";
import sensorControler from "../controllers/sensorController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/user/:id/verify/:token/", userController.handleVerifyEmail);
  router.post("/api/send-email-warning", userController.handleSendEmailWarning);
  router.get("/api/allcode/", userController.handeGetAllCode);
  router.get("/api/get-detail-user-by-id", userController.getDetailUserById);

  router.post("/api/create-new-room", roomControler.createNewRoom);
  router.get("/api/get-all-room/", roomControler.getAllRoom);
  router.get("/api/get-detail-room-by-id", roomControler.getDetailRoomById);

  router.get("/api/get-value-sensor-by-date", sensorControler.getValueSensorByTime);
  router.post("/api/post-data-esp32", sensorControler.handlePostDataFromEsp32);

  router.get("/api/get-device-in-room", deviceController.getAllDeviceInRoom);
  router.get("/api/get-all-device", deviceController.getAllDeviceByUser);
  router.put("/api/update-device", deviceController.handleUpdateDevice);
  router.post("/api/create-new-device", deviceController.handleCreateNewDevice);
  router.get("/api//get-location", deviceController.handleGetLocation);
  router.delete("/api/delete-device", deviceController.handleDeleteDevice);
  router.get("/api/get-status-device", deviceController.handleGetStatusDevice);
  router.post("/api/create-new-status-device", deviceController.handleCreateNewStatusDevice);

  return app.use("/", router);
};

module.exports = initWebRoutes;