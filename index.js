const express = require('express');

const app =express()
const path = require('path')
const server = require('http').Server(app)
// const peer= require("peerjs")
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const {sendMail}  = require("./mailer.js");
const PORT = 3001;


// app.set("view engine" , 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/" , (req,res)=>{
    res.render(path.resolve(__dirname , "public/Views/index.ejs"))
})

app.get("/room/create" , (req,res)=>{
    //create room
    //add self user to db
    const  roomId = uuidv4()
    res.redirect(`/${roomId}`)

})

app.post("/invite" , (req,res)=>{
    const {invites} = req.body
    console.log(invites);
    const promises = [];
    for(let i = 0 ; i < invites.length ; i++){
        const promise = new Promise((resolve,reject)=>{
            sendMail(invites[i] , "Invitation to meeting"  , "Test").then(response=>{resolve(response)}).catch(err=>{reject(err)})
        })
        promises.push(promise);
    }   
    const result = Promise.all(promises).then(data=>{
        
    res.status(200).send(data);
    }).catch(err=>{
        res.status(500).json(err);
    })  
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
        socket.on("disconnect" , ()=>{
            socket.to(roomId).emit("user-disconnected" , userId);
        })
        socket.on("disconnect" , ()=>{
            socket.to(roomId).emit("user-disconnected" , userId);
      })
        socket.on("peerInfo"  , (peers)=>{
            socket.to(roomId).emit("updatePeer" , peers);
        })
    })
})
