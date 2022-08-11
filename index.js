const express = require('express')
const socketio = require('socket.io');
const app = express()
const http = require('http');


app.use(express.static('public'))


app.get('/' , function(req,res){
    res.render("index.ejs");
})


const server = http.createServer(app);

const PORT = 3001;
server.listen(PORT );


var io = socketio(server);

io.sockets.on("connection" , function(socket){

    console.log("connected");
})





