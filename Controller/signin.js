 const handleSignin = (db, bcrypt) => (req, res) => {
	const {email, password}= req.body;
	db.select('*').from('login').where('email', '=', email)
	.then(data=>{
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid)
			return db.select('*').from('users').where('email', '=', email)
				.then(user=>res.json(user[0]))
				.catch(err=> res.status(400).json('invalid data'))
		else
			res.json('invalid user');
		})
	.catch(err=>res.status(400).json('user not found'))
}
module.exports={
	handleSignin: handleSignin
}