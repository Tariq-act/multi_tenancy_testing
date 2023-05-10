const nodemailer = require("nodemailer");
const express=require('express')
const {  handelClientLogin, handelClientRegister } = require('../RouterController/clientController')
const { validate } = require('../middleware/validate')
const clientRoute=express.Router()

clientRoute.post("/register" ,validate,handelClientRegister)
clientRoute.post("/login", handelClientLogin)


module.exports={clientRoute}

// const sendCredentialsEmail = (email, username, password) => {
//   const transporter = nodemailer.createTransport({
//     // Replace with your email configuration
//     service: "Gmail",
//     auth: {
//       user: "naiksrinibas86@gmail.com",
//       pass: "Suvam",
//     },
//   });

//   const mailOptions = {
//     from: "naiksrinibas86@gmail.com", // Replace with the sender's email address
//     to: "suvampandar@gmail.com",
//     subject: "Credentials for Login",
//     text: `Hello ${username},\n\nYour login credentials are as follows:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease use these credentials to log in.\n\nBest regards,\nYour Application`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error occurred while sending email:", error);
//     } else {
//       console.log("Email sent successfully:", info.response);
//     }
//   });
// };

// module.exports = { sendCredentialsEmail };
