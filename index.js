const express = require('express');

const app =express()
const path = require('path')
const server = require('http').Server(app)
// const peer= require("peerjs")
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'); 
const {sendMail}  = require("./mailer.js");
const { addRoom, addResourceToRoom, getRoomById, removeResourceFromRoom } = require('./Service/DbService.js');
const Room = require('./Schema/Room.js');
const PORT = 3001;


// app.set("view engine" , 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/" , (req,res)=>{
    res.render(path.resolve(__dirname , "public/Views/index.ejs"))
})

app.get("/room/create/:id" ,async  (req,res)=>{
    //create room
    //add self user to db
    const {id} = req.params;
    const _room = new Room({
        roomId : id        
             
    });
    await addRoom(_room);

    res.redirect(`/room/${id}`)

})

app.post("/invite" , (req,res)=>{
    const {invites ,roomId} = req.body
    console.log(invites);
    const promises = [];
    for(let i = 0 ; i < invites.length ; i++){
        const promise = new Promise((resolve,reject)=>{
            sendMail(invites[i] , "Invitation to meeting"  , roomId).then(response=>{resolve(response)}).catch(err=>{reject(err)})
        })
        promises.push(promise);
    }   
    const result = Promise.all(promises).then(data=>{
        
    res.status(200).send(data);
    }).catch(err=>{
        res.status(500).json(err);
    })  
})

app.get("/room/:room" ,async(req,res,next)=>{
    const {room} = req.params;
    console.log("room" , room);
    const roomInfo = await getRoomById(room);
    if(!roomInfo && roomInfo.status !== "INACTIVE"){
        res.status(404).send("NOT FOUND");
    }
    req.roomInfo = roomInfo;
    next();

}, async  (req,res)=>{
    //get link room
    const {room} = req.params;
    const {roomInfo} = req;
    console.log(roomInfo);
    res.render(path.resolve(__dirname , "public/Views/room.ejs"), {roomId: room } )
})
server.listen(PORT, ()=>{
    console.log("server started")
});


io.on("connection" , (socket)=>{
    console.log("connected");
    socket.on("join-room" , async (info)=>{
        //save room to database if it is a new room
        console.log("user joined")
        const {roomId , userId} = info;
        await addResourceToRoom(roomId , userId);

        

        socket.join(roomId)
        socket.to(roomId).emit("user-connected" , {userId:userId , message:"New User Connected"});
        // socket.on("disconnect" , ()=>{
        //     socket.to(roomId).emit("user-disconnected" , userId);
        // })
        socket.on("disconnect" , async ()=>{
            await removeResourceFromRoom(roomId , userId).catch(err=>{
                console.error(err );
            })
            socket.to(roomId).emit("user-disconnected" , userId);
      })
        socket.on("peerInfo"  , (peers)=>{
            socket.to(roomId).emit("updatePeer" , peers);
        })
    })
})

main().then(response=>{
    console.log("connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}