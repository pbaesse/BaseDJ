(function() {
	var app = angular.module("mainModule", ["ngMaterial", "md.data.table"]);
	app.controller("MusicController", ["ManipulateDB", function(ManipulateDB) {
		this.musics = [];
		this.artists = [];
		this.genres = [];

		if (localStorage.getItem("selectedMusic") != null) {
			this.selectedMusic = JSON.parse(localStorage.getItem("selectedMusic"));
		} else {
			this.selectedMusic = null;
		}

		this.deleteMusic = function(music) {
			var confirmation = confirm("You really want to delete this music?");

			if (confirmation) {
				ManipulateDB.deleteMusic(music.id);
				alert("Music deleted!");
				goto("musics");
			}
		};

		this.updateMusic = function() {
			var music = new Music(this.selectedMusic.id, this.selectedMusic.title, this.selectedMusic.duration, this.selectedMusic.droptime, this.selectedMusic.killtime, this.selectedMusic.bpm, this.selectedMusic.artist, this.selectedMusic.genre);
			ManipulateDB.updateMusic(music);
			localStorage.removeItem("selectedMusic");
			alert("Music updated!");
			goto('musics');
		}

		this.editMusic = function(music) {
			// tô mal por usar assim
			localStorage.setItem("selectedMusic", JSON.stringify(music));
			goto('edit-music');
		};

		this.addMusic = function() {
			var music = new Music();
			ManipulateDB.insertMusic(music);
			alert("Música '"+title+"' adicionada!");
			goto("musics");
		};

		this.selectMusics = function() {
			this.musics = ManipulateDB.selectAllMusic();
		};

		this.selectGenres = function() {
			this.genres = ManipulateDB.selectAllGenre();
		};

		this.selectArtists = function() {
			this.artists = ManipulateDB.selectAllArtist();
		};	
	}]);

	app.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default').accentPalette("indigo").primaryPalette("teal").warnPalette("pink");
	});

	app.config(function($mdIconProvider) {
	  $mdIconProvider.fontSet('md', 'material-icons');
	});

	app.service("ManipulateDB", manipulateDB);

	manipulateDB.$inject = ['$http'];

	function manipulateDB() {
		var vm = this;

		vm.deleteMusic = deleteMusic;
		vm.updateMusic = updateMusic;
		vm.insertMusic = insertMusic;
		vm.selectAllMusic = selectAllMusic;
		vm.selectAllArtist = selectAllArtist;
		vm.selectAllGenre = selectAllGenre;

		// internal functions
		function deleteMusic(id) {
			var stm = "DELETE FROM music WHERE id = " + id + ";";
			connection.run(stm);
			updateDatabase();
		}

		function updateMusic(music) {
			var title = music.title != undefined ? "'" + music.title + "'" : undefined;
			if (!title) return;
			var id = music.id;
			var duration = music.duration != undefined ? music.duration : 'NULL';
			var droptime = music.droptime != undefined ? music.droptime : 'NULL';
			var killtime = music.killtime != undefined ? music.killtime : 'NULL';
			var bpm = music.bpm != undefined ? music.bpm : 'NULL';
			var idArtist = music.artist.id != undefined ? music.artist.id : 'NULL';
			var idGenre = music.genre.id != undefined ? music.genre.id : 'NULL';

			var stm = "UPDATE music SET title = "+title+", duration = "+duration+", drop_time = "+droptime+", kill_time = "+killtime+", bpm = "+bpm+", id_artist = "+idArtist+", id_genre = "+idGenre+" WHERE id = "+id+";";
			connection.run(stm);
			updateDatabase();
		}

		function insertMusic(music) {
			var title = music.title != undefined ? "'" + music.title + "'" : undefined;
			if (!title) return;
			var duration = music.duration != undefined ? music.duration : 'NULL';
			var droptime = music.droptime != undefined ? music.droptime : 'NULL';
			var killtime = music.killtime != undefined ? music.killtime : 'NULL';
			var bpm = music.bpm != undefined ? music.bpm : 'NULL';
			var idArtist = music.artist.id != undefined ? music.artist.id : 'NULL';
			var idGenre = music.genre.id != undefined ? music.genre.id : 'NULL';

			var stm = "INSERT INTO music(title, duration, drop_time, kill_time, bpm, id_artist, id_genre) VALUES ("+title+", "+duration+", "+droptime+", "+killtime+", "+bpm+", "+idArtist+", "+idGenre+")";
			connection.run(stm);
			updateDatabase();
		}

		function selectAllMusic() {
			var musics = [];
			var stm = connection.prepare("SELECT * FROM music;");
			while(stm.step()) {
				res = stm.getAsObject();

				var genre = null, artist = null;
				if (res.id_genre) {
					var stm2 = connection.prepare("SELECT name FROM genre WHERE id = " + res.id_genre + ";");
					stm2.step();
					var res2 = stm2.getAsObject();
					genre = new Genre(res.id_genre, res2.name);
				}

				if (res.id_artist) {
					var stm3 = connection.prepare("SELECT name FROM artist WHERE id = " + res.id_artist + ";");
					stm3.step();
					var res3 = stm3.getAsObject();
					artist = new Artist(res.id_artist, res3.name);
				}

				musics.push(new Music(res.id, res.title, res.duration, res.drop_time, res.kill_time, res.bpm, artist, genre));
			}

			return musics;
		}

		function selectAllArtist() {
			var artists = [];
			var stm = connection.prepare("SELECT * FROM artist;");		
			while(stm.step()) {
				res = stm.getAsObject();
				artists.push(new Artist(res.id, res.name));
			}
			return artists;
		}

		function selectAllGenre() {
			var genres = [];
			var stm = connection.prepare("SELECT * FROM genre;");
			while(stm.step()) {
				res = stm.getAsObject();
				genres.push(new Genre(res.id, res.name));
			}
			return genres;
		}
	}
})();