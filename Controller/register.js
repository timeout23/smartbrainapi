const nev = require('node-email-validator');
const mailgun = require("mailgun-js");
require ('dotenv').config();
const DOMAIN = 'https://api.mailgun.net/v3/sandboxac21fde8bcdf46188c030a5b020e7870.mailgun.org';
const mg = mailgun({apiKey:'9a35572ac232acd4bfb75856e2b41fa6-2af183ba-c9890b76', domain: DOMAIN});


const handleRegister=(db,bcrypt) => (req,res) => {
	const { email, name, password, isEmailValid } = req.body;
	if(!email || !name || !password || isEmailValid){
		return res.json('invalid entry');
	}
	
	const hash = bcrypt.hashSync(password,10);
	db.transaction(trx=>{
		trx.insert({email,hash})
		.into('login')
		.returning('email')
		.then(loginEmail=>{
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user=>{
					res.json(user[0]);
				})
				.catch(err=>{
					res.status(400).json('Unable to register user');
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err=>res.status(400).json('unable to register'));
}

const handleIsEmailValid = (req, res) =>{
	const {email}=req.body;
	nev(email)
	.then(validation => {
		res.json(validation.isEmailValid)
	})
	.catch(error => res.json(error));
}
const handleIsEmailverified = (req,res) =>{
	const {email}=req.body;
	const data = {
	from: 'timmybaks2002@gmail.com',
	to: email,
	subject: 'Confirm Email',
	text: 'Please click on link to activate your account',
};
mg.messages().send(data, function (error, body) {
	res.json('message sent');
	if (error)
		console.log(error);
});

}

module.exports={
	handleRegister: handleRegister,
	handleIsEmailValid: handleIsEmailValid,
	handleIsEmailverified: handleIsEmailverified
}