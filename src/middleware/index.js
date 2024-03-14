import jwt from "jsonwebtoken";
import db from "../models/index";
require("dotenv").config();
const creatJWT = (payload) => {
  let key = process.env.SECRET_JWT;
  let token = null;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log(error);
  }
  return token;
};
const verifyAccessTokenToken = (token) => {
  let key = process.env.SECRET_JWT;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1].slice(1, -1);
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}
const checkUser = async (userId) => {
  try {
    let user = await db.User.findOne({
      attributes: ["email", "username", "roleID", "id"],
      where: { id: userId },
      raw: true,
    });
    if (user) {
      if (user.roleID === "R1") {
        return true;
      } else if (user.roleID === "R2") {
        return false;
      }
    } else {
      return false;
    }
    return user;
  } catch (error) {
    return null;
  }
};
const checkUserJWT = async (req, res, next) => {
  const accessToken = extractToken(req);
  if (accessToken) {
    let decoded = verifyAccessTokenToken(accessToken);
    if (decoded) {
      console.log("decode", decoded);
      let verifed = await checkUser(decoded.userId);
      next();
    } else {
      return res.status(401).json({
        errCode: -1,
        data: "",
        mesage: "Not Authenticated the user",
      });
    }
  } else {
    return res.status(401).json({
      errCode: -1,
      data: "",
      mesage: "Not Authenticated the user",
    });
  }
};
const refreshToken = (req, res) => {
  let valueRefreshToken = req.body.refreshToken;
  if (valueRefreshToken) {
    valueRefreshToken = valueRefreshToken.slice(1, -1);
    console.log(valueRefreshToken);
    try {
      const decoded = jwt.verify(valueRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded);
      if (decoded) {
        let secretKey;
        if (decoded.role === "R3") {
          secretKey = process.env.SECRET_JWT_USER;
        }
        if (decoded.role === "R2") {
          secretKey = process.env.SECRET_JWT_ADMIN;
        }
        if (decoded.role === "R1") {
          secretKey = process.env.SECRET_JWT_ADMIN_SYS;
        }
        const newAccessToken = jwt.sign({ userId: decoded.userId }, secretKey, {
          expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
        });
        return res.status(200).json({
          errCode: 0,
          accessToken: newAccessToken,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errCode: 1, message: "Invalid refresh token" });
    }
  } else {
    return res.status(400).json({ errCode: -1, message: "Missing required parameter" });
  }
};

// refreshToken();
module.exports = {
  creatJWT,
  verifyAccessTokenToken,
  checkUserJWT,
  refreshToken,
};
