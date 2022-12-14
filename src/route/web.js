import express from "express";
import userController from "../controllers/userController"
import deviceController from "../controllers/deviceController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get("/api/user/:id/verify/:token/",userController.handleVerifyEmail);
    router.get("/api/valuesensor/:type/sensor/:value",userController.handleGetValueSensor);
    router.post("/api/send-email-warning",userController.handleSendEmailWarning);
    
    router.post("/api/post-data-esp32",deviceController.handlePostDataFromEsp32);
    router.get("/api/get-device",deviceController.getDeviceById);
    router.put("/api/update-device",deviceController.handleUpdateDevice);
    router.post("/api/create-new-device",deviceController.handleCreateNewDevice);
    router.get("/api//get-location",deviceController.handleGetLocation);
    router.delete("/api/delete-device",deviceController.handleDeleteDevice);
    router.get("/api/get-status-device",deviceController.handleGetStatusDevice);
    router.post("/api/create-new-status-device",deviceController.handleCreateNewStatusDevice);

    return app.use("/", router);
}

module.exports = initWebRoutes;