
const mongoose = require("mongoose");
const Room = require("../Schema/Room");


const addANewRoomToDatabase = async (room )=>{
    const result = await room.save();
    return result;
}
const addResourceToRoom = async (roomId , devId) =>{
    const result = await Room.findOne( {roomId : roomId}   );
    console.log(result);
    if(!result){

        return null;
    }
    if(result.resourcesConnected.length === 0){
        result.creatorId = devId;
    }
    result.resourcesConnected.push(devId);
    await result.save();
    
}
const removeResourceFromRoom = async (roomId,  devId) =>{
    const result = await Room.findOne({roomId : roomId })
    if(!result){
        return null;
    }
    result.resourcesConnected = result.resourcesConnected.filter(resource=>{
        if(resource != devId){
            return resource;
        }
        return false;
    })
    if(result.resourcesConnected.length == 0){
        result.status = "INACTIVE";
    }
    result.save();
    
}
const getRoomById = async ( id)=>{
    const result = await Room.findOne({roomId:id})
    return result;
}
module.exports.addRoom = addANewRoomToDatabase;
module.exports.addResourceToRoom = addResourceToRoom;
module.exports.getRoomById = getRoomById;
module.exports.removeResourceFromRoom = removeResourceFromRoom;