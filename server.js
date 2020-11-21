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
    host : '127.0.0.1',
    user : 'postgres',
    password : 'theceo@16',
    database : 'smartbrain'
  }
});
db.select('*').from('users').then(data=>{
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get('/',(req,res)=>{
	res.json(database.users);
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
//email verification
app.post ('/isverified', (req,res)=> register.handleIsEmailverified(req,res));

app.listen(3001);