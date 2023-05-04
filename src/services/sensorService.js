import db from "../models/index";
const { Op } = require("sequelize");
import moment from "moment";
let getValueSensorByTime = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.roomId || !inputData.userId || !inputData.date || !inputData.type) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        if (inputData.type === "month" || inputData.type === "date") {
          const dateObj = moment(new Date(+inputData.date));
          const startTime = "" + dateObj.startOf(inputData.type).valueOf();
          const endTime = "" + dateObj.endOf(inputData.type).valueOf();
          let resData = await db.valueSensor.findAll({
            where: {
              roomId: inputData.roomId,
              userId: inputData.userId,
              date: {
                [Op.between]: [startTime, endTime],
              },
            },
            order: [["date", "ASC"]],
            raw: true,
          });
          if (!resData) resData = {};
          resolve({
            errCode: 0,
            data: resData,
          });
        }
      }
      if (inputData.type === "range") {
        let inputDate = inputData.date.split(",");
        const startTime = "" + moment(new Date(+inputDate[0])).startOf("date").valueOf();
        const endTime = "" + moment(new Date(+inputDate[1])).endOf("date").valueOf();
        let resData = await db.valueSensor.findAll({
          where: {
            roomId: inputData.roomId,
            userId: inputData.userId,
            date: {
              [Op.between]: [startTime, endTime],
            },
          },
          order: [["date", "ASC"]],
          raw: true,
        });
        if (!resData) resData = {};
        resolve({
          errCode: 0,
          data: resData,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let createNewValueSensor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.temperature ||
        !data.humidity ||
        !data.dust2_5 ||
        !data.dust10 ||
        !data.press_in ||
        !data.press_out ||
        !data.oxy ||
        !data.userId ||
        !data.roomId
      ) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let date = new Date().getTime();
        let valueSensor = await db.valueSensor.create({
          temperature: data.temperature,
          humidity: data.humidity,
          dust10: data.dust10,
          dust25: data.dust2_5,
          pressIn: data.press_in,
          pressOut: data.press_out,
          oxy: data.oxy,
          date: date,
          roomId: data.roomId,
          userId: data.userId,
        });
        resolve({
          errCode: 0,
          message: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewValueSensor: createNewValueSensor,
  getValueSensorByTime: getValueSensorByTime,
  createNewValueSensor: createNewValueSensor,
};
