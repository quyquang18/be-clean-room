import sensorService from "../services/sensorService";
let getValueSensorByTime = async (req, res) => {
  try {
    let infor = await sensorService.getValueSensorByTime(req.query);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
let handlePostDataFromEsp32 = async (req, res) => {
  let data = req.query;
  try {
    let info = await sensorService.createNewValueSensor(data);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error From the Server",
    });
  }
};
module.exports = {
  getValueSensorByTime: getValueSensorByTime,
  handlePostDataFromEsp32: handlePostDataFromEsp32,
};
