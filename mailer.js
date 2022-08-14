const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config()


const sendMailCode = async (reciever ,subject , uri )=>{
    const email = "hamzausmani021@gmail.com"
    const transporter = await nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : email,
            pass : process.env.MAIL_PASS
        },
       
    })
    
    // "sheryarrajput47@gmail.com"
    const options = {
        from : email,
        to : reciever,
        subject : subject,
        text : `You are invited to meeting by ${email} at 2'o'clock at the following link:\n${uri}\n`
    }
    await transporter.sendMail(options , (err , info)=>{
        if(err){
            
            return false;
        }
        return true;
    
    })

}


module.exports.sendMail = sendMailCode;