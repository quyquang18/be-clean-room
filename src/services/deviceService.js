import db from '../models/index'
const { Sequelize } = require("sequelize");
const updateDevice = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           
            if (!inputData ||!inputData.id ){
                resolve({
                    errCode:1,
                    message: "Missing required parameter"
                })
            }else {
                let device = await db.Device.findOne({
                    where:{id:inputData.id},
                    raw:false
                })
                if(device){
                    device.deviceName = inputData.devicename;
                    device.typeDevice = inputData.typedevice;
                    await device.save();
                    resolve({
                        errCode:0,
                        message:`Update the device succeeds`
                    })

                }else {
                    resolve({
                        errCode:1,
                        message:`device's not found!`
                    })
                }
            }
            

        } catch (error) {
            reject(error)
        }
    })
}
const getDeviceById = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           
            if (!inputData){
                resolve({
                    errCode:1,
                    message: "Missing required parameter"
                })
            }else {
                if(inputData.locationId ==='all'){
                    let data =await db.Location.findAll({
                        where:{userId:inputData.userId},
                        attributes: {
                            exclude:['createdAt','updatedAt']
                        },
                        include:[
                            {model: db.Device, }
                        ],
                        raw: true,
                        nest:true
                    })
                    resolve({
                        errCode:0,
                        data:data,
                    })
                }
                else{
                let data =await db.Location.findAll({
                    where:{userId:inputData.userId,id:inputData.locationId},
                    attributes: {
                        exclude:['createdAt','updatedAt']
                    },
                    include:[
                        {model: db.Device, }
                    ],
                    raw: true,
                    nest:true
                })
                resolve({
                    errCode:0,
                    data:data,
                })}
            }
            

        } catch (error) {
            reject(error)
        }
    })
}
let checkDevice = (deviceName,locationID)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let device =await db.Device.findOne({
                where:{locationID:locationID,deviceName:deviceName},
                attributes: {
                    exclude:['createdAt','updatedAt']
                },
                raw: true,
            })
            if(device) {
                resolve(true)
            }else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let createNewDevice =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(data.mode==='available'){
                console.log('available');
                let check = await checkDevice(data.deviceName,data.locationID);
                if(check){
                    resolve({
                        errCode:1,
                        message:'The device already exists in this location. Please try again'
                    })
                }else {
                    let device = await db.Device.create({
                        deviceName:data.deviceName,
                        typeDevice:data.deviceType,
                        locationID:data.locationID,
                        userId:data.userId,
                    })
                    resolve({
                        errCode:0,
                        message:'successfully added device'
                    })
                }
            }
            else if(data.mode==='new') 
            {
                console.log('new');
                let checkLocation = await db.Location.findOne({
                    where:{
                        location:data.location,
                        userId:data.userId,
                        }
                })
                if(checkLocation){
                    let device = await db.Device.create({
                    deviceName:data.deviceName,
                    typeDevice:data.deviceType,
                    locationID:checkLocation.id,
                    userId:data.userId,
                    })
                    resolve({
                        errCode:0,
                        message:`device has been added to available location ${checkLocation.location} successfully`
                    })
                }else {
                    let location = await db.Location.create({
                        location:data.location,
                        userId:data.userId,
                    })
                    let device = await db.Device.create({
                        deviceName:data.deviceName,
                        typeDevice:data.deviceType,
                        locationID:location.id,
                        userId:data.userId,
                        })
                    resolve({
                        errCode:0,
                        message:`device has been added to new location ${location.location} successfully`
                    })
                }
            }
            
        } catch (error) {
            reject(error)
        }
    })
}
const getLocation = (userId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           
            if (!userId){
                resolve({
                    errCode:1,
                    message: "Missing required parameter"
                })
            }else {
                let data =await db.Location.findAll({
                    where:{userId:userId},
                    attributes: {
                        exclude:['createdAt','updatedAt','userId']
                    },
                })
                resolve({
                    errCode:0,
                    data:data,
                })
            }
            
        } catch (error) {
            reject(error)
        }
    })
}
let deleteDevice =(deviceId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let device = await db.Device.findOne({
                where:{id:deviceId}
            })
            if(!device){
                resolve({
                    errCode:2,
                    message:`The device isn't exist`
                })
            }
            await db.Device.destroy({
                where:{id:deviceId}
            });
            resolve({
                errCode:0,
                message:`The device is deleted`
            })
        } catch (error) {
            reject(error)
        }
    })
}
const getStatusDevice = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!inputData){
                resolve({
                    errCode:1,
                    message: "Missing required parameter"
                })
            }else {
                let values =''
            if(inputData.type ==='day'){
                values =await db.statusDevice.findAll({
                    where:{
                        userId:inputData.userId,
                        locationID:inputData.locationId,
                        deviceId:inputData.deviceId,
                        date:inputData.value
                    },
                    attributes: {
                        exclude:['createdAt','updatedAt']
                    },
                    raw: true,
                    
                })
                resolve({
                    errCode:0,
                    values
                })
            }
            if(inputData.type==='month'){
                values =await db.statusDevice.findAll({
                    where:{
                        userId:inputData.userId,
                        locationID:inputData.locationId,
                        deviceId:inputData.deviceId,
                       where: Sequelize.where(Sequelize.fn("month", Sequelize.col("date")), inputData.value)
                    },
                    attributes: {
                        exclude:['createdAt','updatedAt']
                    },
                    raw: true,
                    
                })
                resolve({
                    errCode:0,
                    values
                })
             
            }
            }
            
        } catch (error) {
            reject(error)
        }
    })
}
const countStatusTime = (date, start, end) => {
    let dateStart = date + ' ' + start;
    let dateEnd = date + ' ' + end;
    var diff = Math.abs(new Date(dateStart.replace(/-/g, '/')) - new Date(dateEnd.replace(/-/g, '/')));

    let seconds = diff / 1000;
    const hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    return (
        (hours < 10 ? '0' + hours : hours) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds)
    );
};
let createNewStatusDevice =(inputData) =>{
    return new Promise(async(resolve,reject)=>{
        try {
                let check =await db.statusDevice.findOne({
                    where:{
                        deviceId:+inputData.deviceId,
                        locationID:+inputData.locationID,
                        userId:+inputData.userId,
                        date:inputData.date,
                        stateEndTime:'00:00:00',
                    },
                    raw:false,
                })
                if(check){
                    if(check.status ===inputData.status){
                        let statusTime = countStatusTime(check.date,check.stateStartTime ,inputData.time);
                        check.stateEndTime = inputData.time;
                        check.statusTime =statusTime;
                        await check.save();
                        resolve({
                            errCode:0,
                            message:'update status end time successful'
                        })
                    }else {
                        let statusTime = countStatusTime(check.date,check.stateStartTime ,inputData.time);
                        check.stateEndTime = inputData.time;
                        check.statusTime =statusTime;
                        await check.save();
                       
                        let statusDevice = await db.statusDevice.create({
                            deviceId:+inputData.deviceId,
                            locationID:+inputData.locationID,
                            userId:+inputData.userId,
                            status:inputData.status,
                            stateStartTime:inputData.time,
                            date:inputData.date,
                            stateEndTime:'00:00:00',
                        })
                        resolve({
                            errCode:0,
                            message:'update status end time successful'
                        })
                    }
                   
                }else {
                    let statusDevice = await db.statusDevice.create({
                        deviceId:+inputData.deviceId,
                        locationID:+inputData.locationID,
                        userId:+inputData.userId,
                        status:inputData.status,
                        stateStartTime:inputData.time,
                        date:inputData.date,
                        stateEndTime:'00:00:00',
                    })
                    resolve({
                        errCode:0,
                        message:'Status value update successful'
                    })
                }
            } 
         catch (error) {
            reject(error)
        }
    })
}
let createNewValueSensor =(data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let date_ob = new Date();
            let day = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let currentDate = year + "-" + month + "-" + day;
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let time = hours + ":" + minutes + ":" + seconds;
            let valueSensor = await db.valueSensor.create({
                temperature:data.temperature,
                humidity:data.humidity,
                dust10:data.dust10,
                dust25:data.dust25,
                pressIn:data.pressIn,
                pressOut:data.pressOut,
                date:currentDate,
                time:time,
                locationID:1,
                userID:1,
            })
                resolve({
                    errCode:0,
                    message:'ok'
                })
            
            
        } catch (error) {
            reject(error)
        }
    })
}
module.exports ={
    getDeviceById:getDeviceById,
    updateDevice:updateDevice,
    createNewDevice:createNewDevice,
    getLocation:getLocation,
    deleteDevice:deleteDevice,
    getStatusDevice:getStatusDevice,  
    createNewStatusDevice:createNewStatusDevice,
    createNewValueSensor:createNewValueSensor,
}