import jwt from "jsonwebtoken";
import db from "../models/index";
const checkUser = async (userId) => {
  try {
    let user = await db.User.findOne({
      attributes: ["email", "username", "roleID", "id"],
      where: { id: userId },
      raw: true,
    });
    return user;
  } catch (error) {
    return null;
  }
};

function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1].slice(1, -1);
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

module.exports.user = () => {
  return async (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    else {
      try {
        jwt.verify(accessToken, process.env.SECRET_JWT_USER);
        next();
      } catch (err) {
        res.status(401).json({ message: "Access Denied!" });
        console.log(err);
      }
    }
  };
};

module.exports.admin = () => {
  return async (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    else {
      try {
        jwt.verify(accessToken, process.env.SECRET_JWT_ADMIN);
        next();
      } catch (err) {
        res.status(401).json({ message: "Access Denied!" });
        console.log(err);
      }
    }
  };
};
module.exports.adminSym = () => {
  return (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_ADMIN_SYS);

      next();
    } catch (err) {
      res.status(401).send({ message: "Access Denied!" });
    }
  };
};
module.exports.userAdmin = () => {
  return (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_USER);
      next();
    } catch (err) {
      exports.admin()(req, res, next);
    }
  };
};
module.exports.userAdminSym = () => {
  return (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_USER);
      next();
    } catch (err) {
      exports.adminSym()(req, res, next);
    }
  };
};
module.exports.adminSym_admin = () => {
  return (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    try {
      let a = jwt.verify(accessToken, process.env.SECRET_JWT_ADMIN);
      next();
    } catch (err) {
      exports.adminSym()(req, res, next);
    }
  };
};
module.exports.userFull = () => {
  return (req, res, next) => {
    const accessToken = extractToken(req);
    if (!accessToken) return res.status(401).send({ message: "Access Denied!" });
    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_USER);
      next();
    } catch (err) {
      exports.adminSym_admin()(req, res, next);
    }
  };
};
