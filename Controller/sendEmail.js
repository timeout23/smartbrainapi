const nodemailer = require ('nodemailer');

 require('dotenv').config();

const credentials ={
	host: 'smtp.gmail.com',
	service: 'gmail',
  port: 25,
  secure: false,
  auth: {
  	type:["PLAIN"],
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS,
    clientId:'',
    clientSecret:'',
    referenceToken:''
  },

   tls: {
        rejectUnauthorized: false,
        ignoreTLS: true
    }
}
const transporter = nodemailer.createTransport(credentials)

module.exports = async (to, content) => {
  const contacts = {
    from: process.env.MAIL_USER,
    to
  }
   const email = Object.assign({}, content, contacts)
 
    // If you are running into errors getting Nodemailer working, wrap the following 
  // line in a try/catch. Most likely is not loading the credentials properly in 
  // the .env file or failing to allow unsafe apps in your gmail settings.
  try{
  	await transporter.sendMail(email)
  }
  catch(err){
  	console.log(err);

  }
  

}
