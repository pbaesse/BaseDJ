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
		var droptime = $scope.selectedMusic.drop_time != undefined ? $scope.selectedMusic.drop_time : 'NULL';
		var killtime = $scope.selectedMusic.kill_time != undefined ? $scope.selectedMusic.kill_time : 'NULL';
		var bpm = $scope.selectedMusic.bpm != undefined ? $scope.selectedMusic.bpm : 'NULL';

		var stm = "UPDATE music SET title = "+title+", duration = "+duration+", drop_time = "+droptime+", kill_time = "+killtime+", bpm = "+bpm+" WHERE id = "+id+";";
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

		var stm = "INSERT INTO music(title, duration, drop_time, kill_time, bpm) VALUES ("+title+", "+duration+", "+droptime+", "+killtime+", "+bpm+")";
		database.run(stm);
		updateDatabase();
		alert("Música '"+title+"' adicionada!");
	};

	$scope.selectMusics = function() {
		var stm = database.prepare("SELECT * FROM music;");
		$scope.musics = [];
		while(stm.step()) {
			res = stm.getAsObject();

			res["duration_formatted"] = formatSeconds(res['duration']);

			$scope.musics.push(res);
		}
	};

// 			$scope.selectMusic = function(music) {
// 				alert("Você escolheu '" + music["title"] + "'!");
// 			};
}]);