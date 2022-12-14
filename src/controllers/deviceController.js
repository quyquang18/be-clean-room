import deviceService from '../services/deviceService'

const getDeviceById = async (req,res)=>{
    try {
        let info =await deviceService.getDeviceById(req.query);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
const handleUpdateDevice = async (req,res)=>{
    let data =req.body;
    try {
        let info =await deviceService.updateDevice(data);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
const handleCreateNewDevice =async (req,res)=>{
    let data =req.body;
    console.log(data)
    try {
        let info =await deviceService.createNewDevice(data);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
const handleGetLocation =async (req,res)=>{
    let userId =req.query.id;
    try {
        let info =await deviceService.getLocation(userId);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
let handleDeleteDevice = async (req,res)=>{
    if(!req.query.id){
        return res.status(500).json({
            errCode:1,
            message: "Missing required parameters",
        })
    }
    let message= await deviceService.deleteDevice(req.query.id);
    return res.status(200).json(message)
}
const handleGetStatusDevice =async (req,res)=>{
    let data =req.query;
    console.log(data)
    try {
        let info =await deviceService.getStatusDevice(data);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
const handleCreateNewStatusDevice =async (req,res)=>{
    let data =req.body;
    try {
        let info =await deviceService.createNewStatusDevice(data);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message:"Error From the Server"
        })
    }
}
let handlePostDataFromEsp32 =async(req,res)=>{
    let data = req.body;
    if(!data.temperature || !data.humidity || !data.dust10 || !data.dust25 || !data.pressIn ||!data.pressOut){
        return res.status(500).json({
            errCode:1,
            message: "Missing required parameters",
        })
    }
    let message= await deviceService.createNewValueSensor(data);
    return res.status(200).json(message)
}
module.exports ={
    getDeviceById:getDeviceById,
    handleUpdateDevice:handleUpdateDevice,
    handleCreateNewDevice:handleCreateNewDevice,
    handleGetLocation:handleGetLocation,
    handleDeleteDevice:handleDeleteDevice,
    handleGetStatusDevice:handleGetStatusDevice,
    handleCreateNewStatusDevice:handleCreateNewStatusDevice,
    handlePostDataFromEsp32:handlePostDataFromEsp32,

}