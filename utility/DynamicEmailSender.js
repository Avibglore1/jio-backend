import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
import fs from "fs";


async function updateTemplateHelper(templatePath, toReplaceObject) {
    let templateContent = await fs.promises.readFile(templatePath, "utf-8");
    const keyArrs = Object.keys(toReplaceObject);
    keyArrs.forEach((key) => {
        templateContent = templateContent.replace(`#{${key}}`, toReplaceObject[key]);
    })
    return templateContent;
}

export const emailSender = async(templatePath, recieverEmail, toReplaceObject)=> {
    try {
        const content = await updateTemplateHelper(templatePath, toReplaceObject);
        // thorugh which service you have to send the mail 
        const sendGridDetails = {
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            auth: {
                user: "avinashkumarofficial95@gmail.com",
                pass: process.env.gmail_password
            }
        }
        const msg = {
            to: recieverEmail,
            from: 'avinashkumarofficial95@gmail.com', // Change to your verified sender
            subject: 'Sending First Email',
            text: "",
            html: content,
        }
        const transporter = nodemailer.createTransport(sendGridDetails);
        await transporter.sendMail(msg);
    } catch (err) {
        console.log("email not send because of the errro", err);
    }
}
