


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

    


    window.location.href = `/${roomId}`;
    
}

function startANewMeeting(){
    // window.location.href = "/room/create";
    if(document.getElementById("checkbox").checked === true){
        let inputData = document.querySelector("#participants").value;
        const emails = inputData.split("\n");
        const URL = "/invite";
        const method = "POST"
        const requestBody = {
            "invites": emails
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

        })

        

    }

    window.location.href= "/room/create";

}

