const express = require('express');
const app = express();
var router = express.Router();
var path = __dirname + '/views/';

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');

const MongoClient = require('mongodb').MongoClient;

router.use(function(req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/',function(req,res){
	db.collection('notitest').find().toArray(function(err, result) {
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
	db.collection('notitest').find().toArray(function(err, result) {
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







