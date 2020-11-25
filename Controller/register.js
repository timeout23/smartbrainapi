const nev = require('node-email-validator');
require ('dotenv').config();

const handleRegister=(db,bcrypt) => (req,res) => {
	const { email, name, password, isEmailValid } = req.body;
	if(!email || !name || !password || isEmailValid===false){
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

module.exports={
	handleRegister: handleRegister,
	handleIsEmailValid: handleIsEmailValid
}