const clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '05c90bc834124d07b883f096319a7fb8'
});

 const handleImage=(db) => (req,res) =>{
	const { id } = req.body;
	db('users').where('id','=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries=>res.json(entries))
	.catch(err=>res.status(400).json('unable to connect'));
}
	const handleApiCall=(req,res)=>{
		const {input}=req.body;
		app.models.initModel({id: Clarifai.FACE_DETECT_MODEL, versions: '53e1df302c079b3db8a0a36033ed2d15'})
    .then(faceModel => {
      res.json(faceModel.predict(input));
    })
    .catch(err=> res.status(400).json('unable to work with api'))
}

module.exports={
	handleImage: handleImage,
	handleApiCall: handleApiCall
}