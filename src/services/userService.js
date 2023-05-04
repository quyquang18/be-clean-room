import db from '../models/index'
import bcrypt from 'bcryptjs'
const crypto = require("crypto");
const { Sequelize, Op } = require("sequelize");
import emailService from './emailService'
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "username", "roleID", "password", "verifed", "id", "image"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let checkPass = await bcrypt.compareSync(password, user.password);
          if (checkPass) {
            if (!user.verifed) {
              userData.errCode = 4;
              userData.message = "Your account has not been verified. Please verify your account to continue";
            } else {
              userData.errCode = 0;
              userData.message = "Ok";
              if (user && user.image) {
                user.image = new Buffer(user.image, "base64").toString("binary");
              }
              delete user.password;
              delete user.verifed;
              userData.user = user;
            }
          } else {
            userData.errCode = 3;
            userData.message = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.message = `User's not found~`;
        }
      } else {
        userData.errCode = 1;
        userData.message = `Your's Email isn't exist in your system. Plz try other Email!`;
      }
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkEmail = await checkUserEmail(data.email);
      if (checkEmail) {
        resolve({
          errCode: 1,
          message: "User email already exists please enter a new email address",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        let user = await db.User.create({
          email: data.email,
          username: data.username,
          password: hashPasswordFromBcrypt,
          phonenumber: data.phonenumber,
          verifed: false,
          roleID: "R3",
        });
        let token = await db.Token.create({
          token: crypto.randomBytes(32).toString("hex"),
          userId: user.id,
        });
        const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
        await emailService.sendSimpleEmail({
          firstname: data.firstname,
          receiverEmail: data.email,
          username: data.username,
          url: url,
        });
        resolve({
          errCode: 0,
          message: "Successful registration.An email has been sent to your account, please verify",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          message: `The User isn't exist`,
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        message: `The user is deleted`,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        if (data.type === "info") {
          user.email = data.email;
          user.phonenumber = data.phonenumber;
          user.gender = data.gender;
          await user.save();
          resolve({
            errCode: 0,
            message: `User information update successful`,
          });
        }
        if (data.type === "role") {
          user.roleID = data.role;
          await user.save();
          resolve({
            errCode: 0,
            message: `Update the Role succeed`,
          });
        }
        if (data.type === "image") {
          user.image = data.avatar;
          await user.save();
          resolve({
            errCode: 0,
            message: `Update the Avatar succeed`,
          });
        }
        if (data.type === "password") {
          let resData = await db.User.findOne({
            where: { id: data.id },
            attributes: ["id", "password"],
            raw: false,
          });
          if (resData) {
            let checkPass = await bcrypt.compareSync(data.oldPassword, resData.password);
            if (checkPass) {
              resData.password = await hashUserPassword(data.newPassword);
              console.log(resData);
              await resData.save();
              resolve({
                errCode: 0,
                message: `Password update successful`,
              });
            } else {
              resolve({
                errCode: 1,
                message: `Old password is incorrect`,
              });
            }
          }
        }
      } else {
        resolve({
          errCode: 1,
          message: `User's not found!`,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let verifyEmail = (inputId, inputToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: inputId },
        raw: false,
      });
      if (!user) {
        resolve({
          status: 400,
          errCode: 1,
          message: `Invalid link`,
        });
      }
      let token = await db.Token.findOne({
        where: {
          userId: user.id,
          token: inputToken,
        },
        raw: false,
      });
      if (!token) {
        resolve({
          status: 400,
          errCode: 1,
          message: `Invalid link`,
        });
      }
      user.verifed = true;
      await user.save();
      await db.Token.destroy({
        where: { userId: user.id },
      });
      resolve({
        status: 200,
        errCode: 0,
        message: `Email verified successfully`,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let sendEmailWarning = async (data) => {
  await emailService.sendEmailWarning({
    firstname: data.firstname,
    receiverEmail: data.email,
    type: data.type,
    date: data.date,
    time: data.time,
    value: data.value,
  });
  return {
    errCode: 0,
    message: "Ok",
  };
};
let getDetailUserById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueEN", "valueVI"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  verifyEmail: verifyEmail,
  sendEmailWarning: sendEmailWarning,
  getAllCodeService: getAllCodeService,
  getDetailUserById: getDetailUserById,
};