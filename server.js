var express = require('express');
var app = express();
var omdb = require('omdb');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var movieFilePath = 'movies.txt';

//mongodb connection variables
/* var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test'; */


/* var insertMovies = function(db, movieName, year, callback) {
   db.collection('movies').insertOne( {
     "name" : movieName,
	 "year" : year
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the movies collection.");
    callback();
  });
};

var findMovie = function(db, movieName, movieYear) {
   var cursor =db.collection('movies').find( { "name": "Frozen" },{"year":2013} );
   cursor.count(function (e, count) {
      if(count>0)
		  return true;
    });
   
   return false;
};

 */
app.use(bodyParser.urlencoded({ extended: false })) 

app.use(bodyParser.json());


app.options("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   //other headers here
    res.status(200).end();
});

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Movie Buff app listening at http://%s:%s", host, port)
})

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/findMovie',function(req,res){
	var movie = req.body.movie;
	console.log(movie);
	/* MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findMovie(db, movie.name, movie.year);
		db.close();
	}); */
	
});


function getWatchedMovies(){
	var moviesWatched=[];
	 if(fs.existsSync(movieFilePath))
	 {
		 moviesWatched = fs.readFileSync(movieFilePath).toString().split('\n');
	 }
	 return moviesWatched;
};

app.post('/watchedmovies',function(req,res){
	var movies = req.body.movies.split(',');
	console.log(movies);
	/* MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		for(var i in movies)
		{
			var movie = movies[i].split(':');
			console.log(movie[0]+" "+movie[1]);
			insertMovies(db, movie[0], movie[1], function() {
				
				});			
		}
		db.close();
	});
	 */
	 var moviesWatched = getWatchedMovies();
	 for(var i in movies)
	 {	
        if(moviesWatched.indexOf(movies[i])==-1) 
		{
			fs.appendFileSync(movieFilePath, movies[i].toString()+"\n");
		}
	 }
	 
	
});

app.post('/moviesearch',function (req, res) {
	console.log(req.body);
   omdb.search({terms:req.body.movieName, type:'movie'}, function(err, movies) {
    if(err) {
        return console.error(err);
    }
	
 
    if(movies.length < 1) {
        return console.log('No movies were found!');
    }
    response=[];
	var i=0;
    movies.forEach(function(movie) {
		var title = movie.title;
		var year = movie.year;
		var poster = movie.poster;
		var imdb = movie.imdb;
		var watched = "notWatched";
		response[i] = { title , year, poster, imdb, watched};
		i++;
    });
	/* MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		movies.forEach(function(movie) {			
			if(findMovie(db, movie.title, movie.year))
			{
				console.log("found "+movie.title);
				response[i].watched = "watched";
			}
			i++;
		});
		db.close();
		
	}); */
	var moviesWatched = getWatchedMovies();
	i=0;
	movies.forEach(function(movie) {
		
		if(moviesWatched.indexOf(movie.title+":"+movie.year)!=-1)
		{
			console.log("Found Movie "+movie.title+":"+movie.year);
			response[i].watched = "watched";
		}		
		i++;
		
    });
	
	res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
	res.send( JSON.stringify( response ) );
});
   
})
