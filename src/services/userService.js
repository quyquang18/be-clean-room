import db from '../models/index'
import bcrypt from 'bcryptjs'
const crypto = require("crypto");
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";
require("dotenv").config();
import emailService from "./emailService";
import notifycationService from "../services/notifycationService";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "username", "roleID", "password", "userVerified", "companyVerified", "id", "image", "companyId"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          if (user.roleID === "R3") {
            let checkPass = await bcrypt.compareSync(password, user.password);
            if (checkPass) {
              if (!user.userVerified) {
                resolve({
                  errCode: 2,
                  message: "Your account has not been verified. Please verify your account to continue",
                });
              }
              if (!user.companyVerified) {
                resolve({
                  errCode: 3,
                  message:
                    "Your account has not been verified by the company. Please contact the relevant department to verify your account to continue",
                });
              } else {
                let accessToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
                let refreshToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

                if (user && user.image) {
                  user.image = new Buffer(user.image, "base64").toString("binary");
                }
                delete user.password;
                delete user.userVerified;
                delete user.companyVerified;
                resolve({
                  errCode: 0,
                  message: "Succeed",
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  user: user,
                });
              }
            } else {
              resolve({
                errCode: 3,
                message: "Wrong password",
              });
            }
          }
          if (user.roleID === "R2") {
            let checkPass = await bcrypt.compareSync(password, user.password);
            if (checkPass) {
              if (!user.userVerified) {
                resolve({
                  errCode: 4,
                  message: "Your account has not been verified. Check Email for Verification",
                });
              } else {
                let company = await db.Company.findOne({
                  where: { email: email },
                  attributes: ["email", "verifed"],
                  raw: true,
                });
                if (!company.verifed) {
                  resolve({
                    errCode: 5,
                    message: "Your account has not been verified by Luxas. Please wait or contact Luxas for support",
                  });
                } else {
                  let accessToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
                  let refreshToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: "1d",
                  });

                  if (user && user.image) {
                    user.image = new Buffer(user.image, "base64").toString("binary");
                  }
                  delete user.password;
                  delete user.userVerified;
                  delete user.companyVerified;
                  resolve({
                    errCode: 0,
                    message: "Succeed",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user,
                  });
                }

              }
            } else {
              resolve({
                errCode: 3,
                message: "Wrong password",
              });
            }
          }
          if (user.roleID === "R1") {
            let checkPass = await bcrypt.compareSync(password, user.password);
            if (checkPass) {
              let accessToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
              let refreshToken = jwt.sign({ userId: user.id, role: user.roleID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

              userData.errCode = 0;
              userData.message = "Ok";
              if (user && user.image) {
                user.image = new Buffer(user.image, "base64").toString("binary");
              }
              delete user.password;
              delete user.userVerified;
              delete user.companyVerified;
              resolve({
                errCode: 0,
                message: "Succeed",
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: user,
              });
            } else {
              resolve({
                errCode: 3,
                message: "Wrong password",
              });
            }
          }
        } else {
          resolve({
            errCode: 6,
            message: "User's not found",
          });
        }
      } else {
        resolve({
          errCode: 7,
          message: "Your's Email isn't exist in your system. Plz try other Email!",
        });
      }
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
          where: {
            roleID: { [Op.not]: "R1" },
          },
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
let getAllUserByCompany = (companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let users = await db.User.findAll({
          where: {
            roleID: "R3",
            companyId: companyId,
          },
          attributes: {
            exclude: ["password"],
          },
        });
        resolve({
          errCode: 0,
          message: "Succeed",
          data: users,
        });
      }
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
          companyId: data.companyId,
          userVerified: false,
          roleID: "R3",
        });
        await notifycationService.sendNotificationsConfirmUser(data.username, data.companyId);
        await notifycationService.sendNotificationsWellcomeUser(data.username, data.companyId, user.id);
        let token = await db.Token.create({
          token: crypto.randomBytes(32).toString("hex"),
          userId: user.id,
        });
        const url = `${process.env.URL_SEND_EMAIL}/user/${user.id}/verify/${token.token}`;
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
let handleCreateNewCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.email || !data.password || !data.phonenumber || !data.address) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let checkEmail = await checkUserEmail(data.email);
        if (checkEmail) {
          resolve({
            errCode: 1,
            message: "User email already exists please enter a new email address",
          });
        } else {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
          let company = await db.Company.create({
            name: data.name,
            email: data.email,
            address: data.address,
            phonenumber: data.phonenumber,
            verifed: false,
          });
          let user = await db.User.create({
            email: data.email,
            username: data.name,
            password: hashPasswordFromBcrypt,
            phonenumber: data.phonenumber,
            userVerified: false,
            companyId: company.id,
            roleID: "R2",
          });
          let token = await db.Token.create({
            token: crypto.randomBytes(32).toString("hex"),
            userId: user.id,
          });
          const url = `${process.env.URL_SEND_EMAIL}/user/${user.id}/verify/${token.token}`;
          await emailService.sendSimpleEmail({
            firstname: data.name,
            receiverEmail: data.email,
            username: data.name,
            url: url,
          });
          resolve({
            errCode: 0,
            message: "Successful registration.An email has been sent to your account, please verify",
          });
        }
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
      user.userVerified = true;
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
let handleGetListCompany = (inputType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputType) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let res = {};
        if (inputType === "UNCONFIMRED") {
          res = await db.Company.findAll({
            where: { verifed: 0 },
          });
        }
        if (inputType === "CONFIRMED") {
          res = await db.Company.findAll({
            where: { verifed: 1 },
          });
        }
        resolve({
          errCode: 0,
          message: "Succeed",
          data: res,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let handleConfirmCompany = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let dataCompany = await db.Company.findOne({
          where: { id: inputData.companyId },
          raw: false,
        });
        if (dataCompany) {
          dataCompany.verifed = 1;
          dataCompany.save();
        }
        let dataUser = await db.User.findOne({
          where: { companyId: inputData.companyId },
          raw: false,
        });
        if (dataUser) {
          dataUser.roleID = "R2";
          dataUser.save();
        }
        resolve({
          errCode: 0,
          message: "Succeed",
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let handleConfirmUserByCompany = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.companyId || !inputData.userId) {
        resolve({
          errCode: 1,
          message: "Missing required parameters",
        });
      } else {
        let dataUser = await db.User.findOne({
          where: { id: inputData.userId, companyId: inputData.companyId },
          raw: false,
        });
        if (dataUser) {
          dataUser.companyVerified = 1;
          dataUser.save();
        }
        resolve({
          errCode: 0,
          message: "Succeed",
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
  handleCreateNewCompany: handleCreateNewCompany,
  handleGetListCompany: handleGetListCompany,
  handleConfirmCompany: handleConfirmCompany,
  getAllUserByCompany: getAllUserByCompany,
  handleConfirmUserByCompany: handleConfirmUserByCompany,
};