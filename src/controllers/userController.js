import userServices from '../services/userService'
require("dotenv").config();
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email && !password) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  } else {
    let userData = await userServices.handleUserLogin(email, password);
    let optionsCookie = { httpOnly: false, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 };
    res.cookie("user_role", userData.accessToken, optionsCookie, { domain: process.env.URL_REACT });
    return res.status(200).json(userData);
  }
};
let handleGetAllUsers = async (req, res) => {
  let id = req.query.type;
  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameter",
      user: [],
    });
  }
  let users = await userServices.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    message: "OK",
    user: users,
  });
};
let handleCreateNewUser = async (req, res) => {
  let message = await userServices.createNewUser(req.body);
  return res.status(200).json(message);
};
let handleCreateNewCompany = async (req, res) => {
  let message = await userServices.handleCreateNewCompany(req.body);
  return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }
  let message = await userServices.deleteUser(req.body.id);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  let data = req.body;
  if (!req.body.id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }
  let message = await userServices.updateUser(data);
  return res.status(200).json(message);
};
let handleVerifyEmail = async (req, res) => {
  let id = req.params.id;
  let token = req.params.token;
  let message = await userServices.verifyEmail(id, token);
  return res.status(message.status).json(message);
};

let handleSendEmailWarning = async (req, res) => {
  let data = req.body;
  if (!data) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameters",
    });
  }
  let message = await userServices.sendEmailWarning(data);
  return res.status(200).json(message);
};
let handeGetAllCode = async (req, res) => {
  try {
    let message = await userServices.getAllCodeService(req.query.type);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let getDetailUserById = async (req, res) => {
  try {
    let infor = await userServices.getDetailUserById(req.query.id);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let handleGetListCompany = async (req, res) => {
  try {
    let infor = await userServices.handleGetListCompany(req.query.type);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let handleConfirmCompany = async (req, res) => {
  try {
    let data = await userServices.handleConfirmCompany(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let handleConfirmUserByCompany = async (req, res) => {
  try {
    let data = await userServices.handleConfirmUserByCompany(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let getAllUserByCompany = async (req, res) => {
  try {
    let data = await userServices.getAllUserByCompany(req.query.companyId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  handleVerifyEmail: handleVerifyEmail,
  handleSendEmailWarning: handleSendEmailWarning,
  handeGetAllCode: handeGetAllCode,
  getDetailUserById: getDetailUserById,
  handleCreateNewCompany: handleCreateNewCompany,
  handleGetListCompany: handleGetListCompany,
  handleConfirmCompany: handleConfirmCompany,
  getAllUserByCompany: getAllUserByCompany,
  handleConfirmUserByCompany: handleConfirmUserByCompany,
};