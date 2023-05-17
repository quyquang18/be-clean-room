import jwt from "jsonwebtoken";
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = {
  verifyToken: verifyToken,
};
