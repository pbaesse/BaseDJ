var app = angular.module("mainModule", ["ngMaterial", "md.data.table"]);
app.controller("MusicController", function() {
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
			var stm = "DELETE FROM music WHERE id = " + music.id + ";";
			database.run(stm);
			updateDatabase();
			alert("Music deleted!");
			goto("musics");
		}
	};

	this.updateMusic = function() {
		var id = this.selectedMusic.id;
		var title = this.selectedMusic.title != undefined ? "'" + this.selectedMusic.title + "'" : undefined;
		if (title == undefined) {
			alert("You should insert the music's title!");
			return;
		}

		var duration = this.selectedMusic.duration != undefined ? this.selectedMusic.duration : 'NULL';
		var droptime = this.selectedMusic.droptime != undefined ? this.selectedMusic.droptime : 'NULL';
		var killtime = this.selectedMusic.killtime != undefined ? this.selectedMusic.killtime : 'NULL';
		var bpm = this.selectedMusic.bpm != undefined ? this.selectedMusic.bpm : 'NULL';
		var id_artist = this.selectedMusic.artist.id != undefined ? this.selectedMusic.artist.id : 'NULL';
		var id_genre = this.selectedMusic.genre.id != undefined ? this.selectedMusic.genre.id : 'NULL';

		var stm = "UPDATE music SET title = "+title+", duration = "+duration+", drop_time = "+droptime+", kill_time = "+killtime+", bpm = "+bpm+", id_artist = "+id_artist+", id_genre = "+id_genre+" WHERE id = "+id+";";
		database.run(stm);
		updateDatabase();

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
		var title = this.title != undefined ? "'" + this.title + "'" : undefined;

		if (title == undefined) {
			alert("You should insert the music's title!");
			return;
		}

		var duration = this.duration != undefined ? this.duration : 'NULL';
		var droptime = this.droptime != undefined ? this.droptime : 'NULL';
		var killtime = this.killtime != undefined ? this.killtime : 'NULL';
		var bpm = this.bpm != undefined ? this.bpm : 'NULL';
		var id_artist = this.id_artist != undefined ? this.id_artist : 'NULL';
		var id_genre = this.id_genre != undefined ? this.id_genre : 'NULL';

		var stm = "INSERT INTO music(title, duration, drop_time, kill_time, bpm, id_artist, id_genre) VALUES ("+title+", "+duration+", "+droptime+", "+killtime+", "+bpm+", "+id_artist+", "+id_genre+")";
		database.run(stm);
		updateDatabase();
		alert("Música '"+title+"' adicionada!");
		goto("musics");
	};

	this.selectMusics = function() {
		var query = this.query;
		var stm = database.prepare("SELECT * FROM music;");
		this.musics = [];
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

			this.musics.push(new Music(res.id, res.title, res.duration, res.drop_time, res.kill_time, res.bpm, artist, genre));
		}
	};

	this.selectGenres = function() {
		var stm = database.prepare("SELECT * FROM genre;");
		this.genres = [];
		while(stm.step()) {
			res = stm.getAsObject();
			this.genres.push(new Genre(res.id, res.name));
		}	
	};

	this.selectArtists = function() {
		var stm = database.prepare("SELECT * FROM artist;");
		this.artists = [];
		while(stm.step()) {
			res = stm.getAsObject();
			this.artists.push(new Artist(res.id, res.name));
		}	
	};	
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').accentPalette("indigo").primaryPalette("teal").warnPalette("pink");
});

app.config(function($mdIconProvider) {
  $mdIconProvider.fontSet('md', 'material-icons');
});