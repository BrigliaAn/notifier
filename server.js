const express = require('express');
const app = express();
var router = express.Router();
var path = __dirname + '/views/';

router.use(function(req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/admin',function(req,res){
	res.sendFile(path +'admin.html');
});

router.get('/index',function(req,res){
	res.sendFile(path + 'index.html');
	console.log(path+'index.html')
});

router.get('/create',function(req,res){
	res.sendFile(path + 'create.html');
	console.log(path+'create.html')
});

router.get('/list',function(req,res){
	res.sendFile(path + 'list.html');
	console.log(path+'list.html')
});

app.use('/',router);
app.use(express.static(__dirname + '/public'));

//app.use("*",function(req,res){
// 	res.sendFile(path + "404.html");
//});

app.listen(3000,function(){
	console.log('Listening on port 3000');
})







