// angular.module("navigation", [])
// 	.controller("PageController", function() {
// 		$scope.changePage = function(page) {
// 			alert("BOOT...");
// 			page = page.toLowerCase();
// 			$(".content .container").load("pages/"+page+".html");
// 			angular.bootstrap($(".content .container"), ["content"]);
// 		}
// 	});


var app = angular.module("myApp", []);
app.controller("MusicController", ['$scope', function($scope) {
	$scope.musics = [];
	$scope.artists = [];
	$scope.genres = [];

	if (localStorage.getItem("selectedMusic") != null) {
		$scope.selectedMusic = JSON.parse(localStorage.getItem("selectedMusic"));
	} else {
		$scope.selectedMusic = null;
	}

	$scope.deleteMusic = function(music) {
		var confirmation = confirm("You really want to delete this music?");

		if (confirmation) {
			var stm = "DELETE FROM music WHERE id = " + music.id + ";";
			database.run(stm);
			updateDatabase();
			alert("Music deleted!");
			callPage("musics");
		}
	};

	$scope.updateMusic = function() {
		var id = $scope.selectedMusic.id;
		var title = $scope.selectedMusic.title != undefined ? "'" + $scope.selectedMusic.title + "'" : undefined;
		if (title == undefined) {
			alert("You should insert the music's title!");
			return;
		}

		var duration = $scope.selectedMusic.duration != undefined ? $scope.selectedMusic.duration : 'NULL';
		var droptime = $scope.selectedMusic.droptime != undefined ? $scope.selectedMusic.droptime : 'NULL';
		var killtime = $scope.selectedMusic.killtime != undefined ? $scope.selectedMusic.killtime : 'NULL';
		var bpm = $scope.selectedMusic.bpm != undefined ? $scope.selectedMusic.bpm : 'NULL';
		var id_artist = $scope.selectedMusic.artist.id != undefined ? $scope.selectedMusic.artist.id : 'NULL';
		var id_genre = $scope.selectedMusic.genre.id != undefined ? $scope.selectedMusic.genre.id : 'NULL';

		var stm = "UPDATE music SET title = "+title+", duration = "+duration+", drop_time = "+droptime+", kill_time = "+killtime+", bpm = "+bpm+", id_artist = "+id_artist+", id_genre = "+id_genre+" WHERE id = "+id+";";
		database.run(stm);
		updateDatabase();

		localStorage.removeItem("selectedMusic");
		alert("Music updated!");
		callPage('musics');
	}

	$scope.editMusic = function(music) {
		// tô mal por usar assim
		localStorage.setItem("selectedMusic", JSON.stringify(music));
		callPage('edit-music');
	};

	$scope.addMusic = function() {
		var title = $scope.title != undefined ? "'" + $scope.title + "'" : undefined;

		if (title == undefined) {
			alert("You should insert the music's title!");
			return;
		}

		var duration = $scope.duration != undefined ? $scope.duration : 'NULL';
		var droptime = $scope.droptime != undefined ? $scope.droptime : 'NULL';
		var killtime = $scope.killtime != undefined ? $scope.killtime : 'NULL';
		var bpm = $scope.bpm != undefined ? $scope.bpm : 'NULL';
		var id_artist = $scope.id_artist != undefined ? $scope.id_artist : 'NULL';
		var id_genre = $scope.id_genre != undefined ? $scope.id_genre : 'NULL';

		var stm = "INSERT INTO music(title, duration, drop_time, kill_time, bpm, id_artist, id_genre) VALUES ("+title+", "+duration+", "+droptime+", "+killtime+", "+bpm+", "+id_artist+", "+id_genre+")";
		database.run(stm);
		updateDatabase();
		alert("Música '"+title+"' adicionada!");
	};

	$scope.selectMusics = function() {
		var stm = database.prepare("SELECT * FROM music;");
		$scope.musics = [];
		while(stm.step()) {
			res = stm.getAsObject();

			var genre = null, artist = null;
			if (res.id_genre) {
				var stm2 = database.prepare("SELECT name FROM genre WHERE id = " + res.id_genre + ";");
				stm2.step();
				var res2 = stm2.getAsObject();
				genre = new Genre(res.id_genre, res2.name);
			}

			if (res.id_artist) {
				var stm3 = database.prepare("SELECT name FROM artist WHERE id = " + res.id_artist + ";");
				stm3.step();
				var res3 = stm3.getAsObject();
				artist = new Artist(res.id_artist, res3.name);
			}

			$scope.musics.push(new Music(res.id, res.title, res.duration, res.drop_time, res.kill_time, res.bpm, artist, genre));
		}
	};

	$scope.selectGenres = function() {
		var stm = database.prepare("SELECT * FROM genre;");
		$scope.genres = [];
		while(stm.step()) {
			res = stm.getAsObject();
			$scope.genres.push(new Genre(res.id, res.name));
		}	
	};

	$scope.selectArtists = function() {
		var stm = database.prepare("SELECT * FROM artist;");
		$scope.artists = [];
		while(stm.step()) {
			res = stm.getAsObject();
			$scope.artists.push(new Artist(res.id, res.name));
		}	
	};	
}]);