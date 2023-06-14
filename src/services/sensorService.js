import db from "../models/index";
const { Op } = require("sequelize");
import moment from "moment";
let getValueSensorByTime = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.roomId || !inputData.companyId || !inputData.date || !inputData.type) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        if (inputData.type === "month" || inputData.type === "date") {
          const dateObj = moment(new Date(+inputData.date)).utcOffset("+07:00");
          const startTime = dateObj.startOf(inputData.type).valueOf();
          const endTime = dateObj.endOf(inputData.type).valueOf();
          let resData = await db.valueSensor.findAll({
            where: {
              roomId: +inputData.roomId,
              companyId: +inputData.companyId,
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
        const startTime = moment(new Date(+inputDate[0])).utcOffset("+07:00").startOf("date").valueOf();
        const endTime = moment(new Date(+inputDate[1])).utcOffset("+07:00").endOf("date").valueOf();
        let resData = await db.valueSensor.findAll({
          where: {
            roomId: +inputData.roomId,
            companyId: +inputData.companyId,
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
    console.log(data);
    try {
      if (
        !data.temperature ||
        !data.humidity ||
        !data.dust2_5 ||
        !data.dust10 ||
        !data.press_difference ||
        !data.oxy ||
        !data.companyId ||
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
          differPressure: data.press_difference,
          oxy: data.oxy,
          date: date,
          roomId: data.roomId,
          companyId: data.companyId,
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
let getValueThreshold = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.Type_sensor || !inputData.roomId || !inputData.companyId) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let data = await db.Threshold_value.findOne({
          where: {
            roomId: inputData.roomId,
            companyId: inputData.companyId,
            Type_sensor: inputData.Type_sensor,
          },
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          message: "ok",
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
let updateValueThreshold = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.Type_sensor || !inputData.roomId || !inputData.companyId || !inputData.valueUp || !inputData.valueDown || !inputData.unit) {
        resolve({
          errCode: 1,
          data: "Missing required parameter",
        });
      } else {
        let [valueThres, created] = await db.Threshold_value.findOrCreate({
          where: {
            companyId: inputData.companyId,
            roomId: inputData.roomId,
            Type_sensor: inputData.Type_sensor,
          },
          defaults: {
            companyId: inputData.companyId,
            roomId: inputData.roomId,
            Type_sensor: inputData.Type_sensor,
            valueUp: inputData.valueUp,
            valueDown: inputData.valueDown,
            unit: inputData.unit,
          },
          raw: false,
        });
        if (created) {
          resolve({
            errCode: 0,
            message: "Create New value threshold Succeed !",
          });
        }
        if (!created) {
          valueThres.valueUp = inputData.valueUp;
          valueThres.valueDown = inputData.valueDown;
          valueThres.unit = inputData.unit;
          valueThres.save();
          resolve({
            errCode: 0,
            message: "update value threshold succeed !",
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = {
  getValueSensorByTime: getValueSensorByTime,
  updateValueThreshold: updateValueThreshold,
  getValueThreshold: getValueThreshold,
  createNewValueSensor: createNewValueSensor,
};
