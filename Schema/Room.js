const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    resourcesConnected : {
        type : [String],
        default: []
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    
    roomId : {
        type : String,
        default : null,
        unique:true
    },
    status : {
        type : String,
        enum: ["ACTIVE" , "INACTIVE"],
        default: "ACTIVE"
    }


})
const Room = mongoose.model("Room" ,roomSchema)
module.exports = Room;