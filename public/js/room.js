

let rootId;
var listedPeers = {};

let videoIsOn = true;
let micIsOn = true;

console.log("testing");
const socket = io();
const peer = new Peer(undefined , {
    host : "/",
    port : '3000'
})

$(document).ready(function(){
    
    setTimeout(()=>{
        fetch(`http://localhost:3001/room/users/${roomId}`)
        .then(data=>data.json())
        .then(data=>{
            console.log("userdata" , data);
            document.getElementById("user-list").innerHTML  = "";
            for(let i = 0 ; i < data.resourcesConnected.length ; i++){
                document.getElementById("user-list").innerHTML += `<li style="font-size:10px">${data.resourcesConnected[i]} </li>`
            }

        }).catch(err=>{
            console.log(err);
        })
    },500)
    
    
    socket.on("turnOnVideo" , (id)=>{
        console.log("id:on" , id);
        document.getElementById(id).play()
    })
    socket.on("turnOffVideo" , (id)=>{

        console.log("id:off",id)
        document.getElementById(id).pause()
  
    })
    socket.on("turnOnMic" , (user)=>{
        console.log("on" ,user)
        document.getElementById(user).muted = false;
    })
    socket.on("turnOffMic" , (user)=>{
        console.log("off" , user);
        document.getElementById(user).muted = true;
    })
    
    document.getElementById("toggle-video").addEventListener('click',()=>{
        console.log(peer.id);
        videoIsOn = !videoIsOn;
        if(videoIsOn ===false){
            console.log("video paused")
            document.getElementById(peer.id).pause()
            socket.emit("videoOff" , peer.id);
        }else{
            
            console.log("video played")
            document.getElementById(peer.id).play()
            socket.emit("videoOn" , peer.id);
        }
        
    }) 

    document.getElementById("end-call").addEventListener("click" , ()=>{
        console.log("ending meethiong");
        document.getElementById(peer.id).remove();
        
        socket.emit("remove-user");
        window.location.href= "/";
    })


    document.getElementById("toggle-mic").addEventListener("click" , ()=>{
        
        micIsOn = !micIsOn;
        if(micIsOn === true){
            console.log("mic pause")
            
            socket.emit("micOff" , peer.id)
        }else{
            console.log("mic play")
            
            socket.emit("micOn" , peer.id)
        }
        // console.log(HTMLMediaElement.audioTracks)
    })
let videoGrid = document.querySelector("#videoContainer");
    
function addUserVideo(div,textField,_video , stream , id=null , muted=false){
    div.classList.add("bg-red")
    textField.innerText = "test";
    textField.classList.add("text-center")
    _video.srcObject = stream;
    _video.muted = muted;
    _video.id = id;

    div.append(_video);
    div.append(textField);
    videoGrid.append(div);
    _video.play()
}
 
let count = 0;
var getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia ||navigator.msGetUserMedia;
// console.log(getUserMedia);
getUserMedia({video:true , audio:true}, function(stream) {
    console.log(stream);
    let div = document.createElement("div");
    let textField = document.createElement("p")
    addUserVideo(div,textField , document.createElement('video'),stream , rootId , true );
    
    
    peer.on('call' , (callObject)=>{
        console.log("call came" );
        callObject.answer(stream);
        listedPeers[ callObject.peer] = callObject;
        let div = document.createElement("div");
    let textField = document.createElement("p")
        let video = document.createElement('video')
          
        callObject.on("stream" , otherVideoStream=>{
            console.log("after answering display" + count);
            count +=1;
            if(count %2 == 0){
                
                addUserVideo(div,textField,video ,otherVideoStream  , callObject.peer);
                
            }    
            
            
        })
        

        callObject.on("close" , ()=>{
            div.remove()
            // video.remove()
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
        let div = document.createElement("div");
        let textField = document.createElement("p")
        let video = document.createElement("video");
            

        call.on('stream' , (remoteStream)=>{
            console.log("displaying video frame remote")
            count +=1;
            if(count %2 == 0){
                console.log("remote",remoteStream);
                addUserVideo(div, textField , video ,remoteStream , userId);
                
            }
            
        })
       
        call.on('close' , ()=>{
            console.log("close");
            div.remove()
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
