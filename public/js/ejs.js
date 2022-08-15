
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


$(document).ready(()=>{
    document.querySelector("#checkbox").addEventListener("change" , ()=>{
        if(document.getElementById("checkbox").checked === true){
            $("#participants").prop('disabled' ,false);
        }else{
            $("#participants").prop('disabled' ,true);
            
        }
    })
    
    
})


function startMeeting(){
    console.log("dawd");
    let roomId = document.querySelector("#roomid").value;
    if(roomId == ""){
        console.log("roomID should not be empty");
    }
    
    


    window.location.href = `/room/${roomId}`;
    
}

function startANewMeeting(){
    // window.location.href = "/room/create";
    let goToNext= true;
    const id = create_UUID()
    if(document.getElementById("checkbox").checked === true){
        let inputData = document.querySelector("#participants").value;
        const emails = inputData.split("\n");
        const URL = "/invite";
        const method = "POST"
        
        const requestBody = {
            "invites": emails,
            "roomId" : id
        }
            
        //check email validitiy
        
        //send post request to send emails to the followin emails
        fetch(URL , {
            method : method,
            headers:{
                "content-type":"application/json"
            },
            body : JSON.stringify(requestBody)
        }).then(data=>{
            
        }).catch(err=>{
            goToNext = false;
            window.alert("errror inviting participants");
        })
        

    }
    if(goToNext === true){
        window.location.href = `/room/create/${id}`
    }
    

}

