var app = angular.module("movieApp", []);

app.controller("movieController", function($scope,$http) {
    $scope.movieName="";
	
	
	var requestTransform = function(obj) {
			var str = [];
			for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		}
    $scope.searchMovie = function(){
	$http({
		method: 'POST',
		url: 'http://localhost:8081/moviesearch',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: requestTransform,
		data: {movieName: $scope.movieName, password: $scope.password}
		})
		.then(function(response) {
			$scope.movies = response.data;
			$('#markWatched').css('display','none');  	
		});
	}
	
	$scope.markMoviesWatched = function(){
	var watchedMovies = [];
	var selectedMovies = $('.selectedMovie');
	var len = selectedMovies.length;
	for(var i=0;i<len;i++)
	{
		console.log($(selectedMovies[i]).attr('id'));
	   watchedMovies.push($(selectedMovies[i]).attr('id'));
	}	
	console.log(watchedMovies);
	$http({
		method:	'POST',
		url: 'http://localhost:8081/watchedmovies',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		transformRequest: requestTransform,
		data: {movies: watchedMovies}
		})
		.then(function(response) {
			$('#markWatched').css('display','none');  	
		});
	}
});