
let rootId;
var listedPeers = {};
console.log("testing");
const socket = io();
const peer = new Peer(undefined , {
    host : "/",
    port : '3000'
})

$(document).ready(function(){
    

let videoGrid = document.querySelector("#videoContainer");
    
function addUserVideo(_video , stream , id=null , muted=false){
    _video.srcObject = stream;
    _video.muted = muted;
    _video.id = id;
    
    videoGrid.append(_video);
    _video.play()
}
 
let count = 0;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true,audio:true}, function(stream) {
    
    addUserVideo(document.createElement('video'),stream , rootId , true );
    
    
    peer.on('call' , (callObject)=>{
        console.log("call came" );
        callObject.answer(stream);
        listedPeers[ callObject.peer] = callObject;
        let video = document.createElement('video')
                
        callObject.on("stream" , otherVideoStream=>{
            console.log("after answering display" + count);
            count +=1;
            if(count %2 == 0){
                addUserVideo(video ,otherVideoStream  , callObject.peer);
            
            }    
            
            
        })
        callObject.on("close" , ()=>{
            video.remove()
        })

    })
    socket.on("user-connected" , (payload)=>{
        setTimeout(()=>{
            const {userId , message} = payload;
            if(!rootId){
                rootId = userId
            }
            console.log(userId);
        console.log(`A new user with ${userId} conncected <---`)
        count +=1;
        
        var call = peer.call(userId , stream);
        listedPeers[userId] =call;
        let video = document.createElement("video");
        call.on('stream' , (remoteStream)=>{
            console.log("displaying video frame remote")
            count +=1;
            if(count %2 == 0){
                addUserVideo(video ,remoteStream , userId);
                
            }
            
        })
        call.on('close' , ()=>{
            console.log("close");
            video.remove()
            document.getElementsByClassName("toast-container")[0].innerHTML=`${userId} disconnected`
            
            $(".toast-container").show()
            
            setTimeout(()=>{
                $(".toast-container").hide()

                
            },2000)
        })
        } , 500)
        
    })    

}, function(err) {
  console.log('Failed to get local stream' ,err);
});

peer.on('open' , id=>{
    socket.emit("join-room" , {roomId , userId:id})
    rootId = id;
    
})

})
    
socket.on("user-disconnected" , (userId)=>{
    console.log("disconnected");
    listedPeers[userId].close();
    

})

socket.on("updatePeer" , (peers)=>{
    console.log(peers);
})

socket.on("connection" , ()=>{
    console.log("connceted");
})

