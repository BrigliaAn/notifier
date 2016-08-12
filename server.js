const express = require('express');
const app = express();
var router = express.Router();
var path = __dirname + '/views/';

var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');

const MongoClient = require('mongodb').MongoClient;

router.use(function(req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/',function(req,res){
	db.collection('notitest').find().sort({_id:-1}).limit(6).toArray(function(err, result) {
  		if(err){
  			console.log(err);
  		}
  		res.render(path + 'admin.ejs', {notitest: result});
	})
});

router.get('/index',function(req,res){
	res.sendFile(path + 'index.html');
});

router.get('/create',function(req,res){
	res.sendFile(path + 'create.html');
});

router.get('/list',function(req,res){
	db.collection('notitest').find().sort({_id:-1}).limit(50).toArray(function(err, result) {
  		if(err){
  			console.log(err);
  		}
		res.render(path + 'list.ejs', {notitest: result});
	})
});

router.post('/createNotification',function(req,res){
	db.collection('notitest').save(req.body, (err, result) => {
    if (err) {
    	return console.log(err)
    }
    console.log('saved to database')
	res.sendFile(path + 'create.html');
  })	
});

router.get('/delete/:id',function(req,res){
	console.log(req.params.id);
	db.collection('notitest').remove({_id : ObjectId(req.params.id)},function(err,del){
		if(err) console.log(err);
		console.log("deleted  ", del);
	});
	res.redirect('/list');
});

router.get('/edit',function(req,res){
	console.log(result);
	res.render(path + 'edit.ejs');
});

router.get('/edit/:id',function(req,res){
	console.log(req.params.id);
	db.collection('notitest').findOne({_id: ObjectId(req.params.id)},function(err,result){
		if(err) console.log(err);
		res.redirect('/edit',result);
	});
});

app.use('/',router);
app.use(express.static(__dirname + '/public'));

//app.use("*",function(req,res){
// 	res.sendFile(path + "404.html");
//});


var db;

MongoClient.connect('mongodb://antonella:539briglia@ds153715.mlab.com:53715/linea291-notifier', (err, database) => {
  if (err){
  	return console.log(err)
  }
  db = database
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000')
  })
})

//app.listen(process.env.PORT || 5000);

//app.listen(3000,function(){
//	console.log('Listening on port 3000');
//})







