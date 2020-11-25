const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const  knex = require('knex');
require('dotenv').config();
const register = require ('./Controller/register');
const signin = require ('./Controller/signin');
const profile = require ('./Controller/profile');
const image = require ('./Controller/image');




const db = knex ({
  client: 'pg',
  connection: {
   connectionString: process.env.DATABASE_URL,
   ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{
	res.json('its working');
}); 
//signin
app.post('/signin', signin.handleSignin(db,bcrypt) );
//register
app.post('/register', register.handleRegister(db,bcrypt));
//profile
app.get('/profile/:id', profile.handleProfile(db));
//imageput
app.put('/image',image.handleImage(db));
app.post('/imageapi',(req,res)=>image.handleApiCall(req,res));
//email validation
app.post ('/emailverify',(req,res)=>register.handleIsEmailValid(req,res));

const PORT= process.env.PORT
app.listen(PORT||3001, ()=>{
	console.log(`server is listening to port ${PORT}`)
});