const express = require('express');

const app =express()
const path = require('path')
const server = require('http').Server(app)
// const peer= require("peerjs")
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const PORT = 3001;

// app.set("view engine" , 'ejs');
app.use(express.static("public"));

app.get("/" , (req,res)=>{
    res.render(path.resolve(__dirname , "public/Views/index.ejs"))
})

app.get("/room/create" , (req,res)=>{
    //create room
    //add self user to db
    const  roomId = uuidv4()
    res.redirect(`/${roomId}`)

})

app.get("/:room" ,  (req,res)=>{
    //get link room
    const {room} = req.params;
    res.render(path.resolve(__dirname , "public/Views/room.ejs"), {roomId: room } )
})
server.listen(PORT);


io.on("connection" , (socket)=>{
    console.log("connected");
    socket.on("join-room" , (info)=>{
        //save room to database if it is a new room
        const {roomId , userId} = info;
        socket.join(roomId);
        socket.to(roomId).emit("user-connected" , {userId:userId , message:"New User Connected"});
    })


    socket.on("disconnecting" , ()=>{
        console.log(this)    
       
    })
})
