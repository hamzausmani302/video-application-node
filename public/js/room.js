

console.log("testing");
const socket = io();
const peer = new Peer(undefined , {
    host : "/",
    port : '3000'
})
var videoGrid = $("#video-container")
console.log("a",videoGrid)
const playVideo = document.createElement('video');
playVideo.muted = true;

function addStreamVideo(video ,stream){
    video.srcObject=stream
    video.addEventListener("loadedmetadata" , ()=>{
        console.log(stream)        
        video.play()
    })
    videoGrid.append(playVideo)
}
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true, audio: true}, function(stream) {
  var call = peer.call('another-peers-id', stream);
  call.on('stream', function(remoteStream) {
        addStreamVideo(playVideo , stream)
    // Show stream in some video/canvas element.
  });
}, function(err) {
  console.log('Failed to get local stream' ,err);
});

peer.on('open' , id=>{
    socket.emit("join-room" , {roomId , userId:id})
})

    // if(roomId){
    //     const userId = crypto.randomUUID();

    //     console.log(roomId , " ", userId);
    //     socket.emit("join-room" , {roomId , userId})
    // }
    


socket.on("user-connected" , (payload)=>{
    const {userId , message} = payload;
    console.log(`A new user with ${userId} conncected`)
})
socket.on("user-disconnected" , (payload)=>{
    const { message} = payload;
    console.log(message)
})
socket.on("connection" , ()=>{
    console.log("connceted");
})

