var express = require('express');
var app = express();
var path =require('path');

var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).any());


app.use(express.static('site/public/Pictures'));
app.use(express.static('public'));

//setting view engine to ejs
app.set('view engine', 'ejs');


app.get('/',function(req,res){
	
	console.log('got request for main page');
	//var file = path.join(__dirname, 'site', 'index.html');
	//console.log(file);
	res.header('Access-Control-Allow-Origin', '*');

	res.render('pages/index');
	
});
app.get('/file_upload',function(req,res){
	
	console.log('got request for main page');
	var file = path.join(__dirname, 'yo.html');
	//console.log(file);
	res.sendFile(file);
	
});
var i=0;
global.fileCount =0;
app.post('/file_upload', function (req, res) {
	global.fileCount = req.files.length;
	var ob =this;
	i=0;
    req.files.forEach(function(file)
	{
		console.log(file.originalname);
		console.log(file.path);
		console.log(file.type);  
		readAndWriteFile(file,res);
	});
})

var readAndWriteFile = function(file,res)
{
	var filePath = __dirname + "/uploadedFiles/" + file.originalname;
	fs.readFile( file.path, function (err, data) {
	fs.writeFile(filePath, data, function (err) {
		if( err ){
			console.log( err );
        }
		else{
			
			i++; 
			console.log(i);
			res.write( file.originalname+" uploaded Successfully\r\n");
				if(i==global.fileCount)
				res.end("files uploaded Successfully");
        }       
    });
   });	
}



var server = app.listen(8082,function(){
	
	var host = server.address().address
	var port = server.address().port
	
	console.log("Gamoder.com listening at http://%s:%s",host,port)
});