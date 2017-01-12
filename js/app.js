(function() {
	var app = angular.module("mainModule", ["ngMaterial", "md.data.table"]);
	app.controller("MusicController", ["ManipulateDB", "$mdDialog", function(ManipulateDB, $mdDialog) {
		
		this.musics = [];
		this.artists = [];
		this.genres = [];
		this.tags = [];
		this.playlists = [];

		this.tagsOut = [];
		this.selectedItem = null;
		this.selectedTags = [];

		if (localStorage.getItem("selectedMusic") != null) {
			var tmpMusic = JSON.parse(localStorage.getItem("selectedMusic"));
			var artist = new Artist(tmpMusic.artist.id, tmpMusic.artist.name);
			var genre = new Genre(tmpMusic.genre.id, tmpMusic.genre.name);
			var tags = [];
			if (tmpMusic.tags) {
				tmpMusic.tags.forEach(function(value) {
					tags.push(new Tag(value.id, value.name));
				});
			}
			this.selectedMusic = new Music(tmpMusic.id, tmpMusic.title, tmpMusic.duration, tmpMusic.droptime, tmpMusic.killtime, tmpMusic.bpm, artist, genre, tags);
		} else {
			this.selectedMusic = null;
		}

		this.showMusic = function(music) {
			localStorage.setItem("selectedMusic", JSON.stringify(music));
			goto("show-music");
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
			var music = new Music(this.selectedMusic.id, this.selectedMusic.title, this.selectedMusic.duration, this.selectedMusic.droptime, this.selectedMusic.killtime, this.selectedMusic.bpm, this.selectedMusic.artist, this.selectedMusic.genre, this.selectedMusic.tags);
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
			console.log("selectMusic called");
		};

		this.selectGenres = function() {
			this.genres = ManipulateDB.selectAllGenre();
		};

		this.selectArtists = function() {
			this.artists = ManipulateDB.selectAllArtist();
		};	

		this.selectPlaylists = function() {
			this.playlists = ManipulateDB.selectAllPlaylist();
		};

		this.selectTags = function() {
			this.tags = ManipulateDB.selectAllTag();
			if (this.selectedMusic) {
				this.tagsOut = diffById(this.tags, this.selectedMusic.tags);
			}
		};

		this.queryTags = function() {
			this.musics = ManipulateDB.selectMusicByTags(this.selectedTags);
			console.log("queryTags called");
		};

		this.addPlaylist = function(ev) {
			var confirm = $mdDialog.prompt()
				.title("What's the playlist's name?")
				.placeholder("Playlist name")
				.ariaLabel("Playlist name")
				.targetEvent(ev)
				.ok('Done')
				.cancel("Cancel");

			$mdDialog.show(confirm).then(function(name) {
				var playlist = new Playlist(0, name);
				ManipulateDB.insertPlaylist(playlist);
				alert("Go to playlists. [TODO: fix loading]");
				// goto('playlists');
			}, function() {
				// do nothing
			});
		};

		this.deletePlaylist = function(id, ev) {
			var confirm = $mdDialog.confirm()
				.title("Are you sure?")
				.textContent("You cannot undo this action.")
				.ariaLabel("Confirmation")
				.targetEvent(ev)
				.ok('Delete')
				.cancel("Cancel");

			$mdDialog.show(confirm).then(function() {
				ManipulateDB.deletePlaylist(id);
				alert("Go to playlists. [TODO: fix loading]");
				// goto('playlists');
			}, function() {
				// do nothing
			});			
		};

		this.editPlaylist = function(playlist, ev) {
			var confirm = $mdDialog.prompt()
				.title("What's the new playlist's name?")
				.placeholder("Playlist name")
				.initialValue(playlist.name)
				.ariaLabel("Playlist name")
				.targetEvent(ev)
				.ok('Save')
				.cancel("Cancel");

			$mdDialog.show(confirm).then(function(name) {
				playlist.name = name;
				ManipulateDB.updatePlaylist(playlist);
				alert("Go to playlists. [TODO: fix loading]");
				// goto('playlists');
			}, function() {
				// do nothing
			});
		}

		function diffById(arrayAll, arrayIn) {
			// var start = new Date().getTime();
			var arrayOut = [];
			arrayAll.forEach(function(valueA, indexA, arrayA) {
				var exists = false;
				
				arrayIn.forEach(function(valueI, indexI, arrayI) {
					if (valueA.id == valueI.id) {
						exists = true;
					}
				});

				if (!exists) {
					arrayOut.push(valueA);
				}
			});
			
			// var end = new Date().getTime();
			// console.log("It takes " + (end - start) + "ms")
			return arrayOut;
		};
	}]);

	// S E R V I C E S
	app.service("ManipulateDB", manipulateDB);
	manipulateDB.$inject = ['$http'];

	function manipulateDB() {
		var self = this;

		self.deleteMusic = deleteMusic;
		self.updateMusic = updateMusic;
		self.insertMusic = insertMusic;
		self.selectAllMusic = selectAllMusic;
		self.selectAllArtist = selectAllArtist;
		self.selectAllGenre = selectAllGenre;
		self.selectAllTag = selectAllTag;
		self.selectMusicByTags = selectMusicByTags;
		self.selectAllPlaylist = selectAllPlaylist;
		self.insertPlaylist = insertPlaylist;
		self.deletePlaylist = deletePlaylist;
		self.updatePlaylist = updatePlaylist;

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

			if (music.tags) {
				var stm1 = "DELETE FROM music_tag WHERE id_music = "+id+";";
				connection.run(stm1);

				var values = "";
				music.tags.forEach(function(tag, index, array) {
					values += "("+id+","+tag.id+")";
					if (index+1 <= array.length - 1 ) {
						values += ", ";
					}
				});
				var stm2 = "INSERT INTO music_tag(id_music, id_tag) VALUES " + values + ";";
				connection.run(stm2);
			}

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

				var stm4 = connection.prepare("SELECT tag.* FROM tag INNER JOIN music_tag ON music_tag.id_tag = tag.id WHERE music_tag.id_music = "+res.id+";");

				var tags = [];
				while(stm4.step()) {
					res4 = stm4.getAsObject();
					tags.push(new Tag(res4.id, res4.name));
				}

				musics.push(new Music(res.id, res.title, res.duration, res.drop_time, res.kill_time, res.bpm, artist, genre, tags));
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

		function selectAllTag() {
			var tags = [];
			var stm = connection.prepare("SELECT * FROM tag");
			while(stm.step()) {
				res = stm.getAsObject();
				tags.push(new Tag(res.id, res.name));
			}
			return tags;
		}

		function selectMusicByTags(tags) {
			var filter = "";
			if (tags && tags.length > 0) {
				var values = "music_tag.id_tag = ";
				tags.forEach(function(value, index, array) {
					values += value.id + "";
					if (index + 1 <= array.lenght - 1) {
						values += " OR ";
					}
				});
				var filter = "INNER JOIN music_tag ON music.id = music_tag.id_music WHERE " + values + ";";
			}

			var musics = [];
			var stm = connection.prepare("SELECT music.* FROM music "+filter+";");
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

				var stm4 = connection.prepare("SELECT tag.* FROM tag INNER JOIN music_tag ON music_tag.id_tag = tag.id WHERE music_tag.id_music = "+res.id+";");

				var tags = [];
				while(stm4.step()) {
					res4 = stm4.getAsObject();
					tags.push(new Tag(res4.id, res4.name));
				}

				musics.push(new Music(res.id, res.title, res.duration, res.drop_time, res.kill_time, res.bpm, artist, genre, tags));
			}

			return musics;
		}

		function selectAllPlaylist() {
			var playlists = [];
			var stm = connection.prepare("SELECT * FROM playlist;");
			while(stm.step()) {
				res = stm.getAsObject();
				playlists.push(new Playlist(res.id, res.name));
			}
			return playlists;
		}

		function insertPlaylist(playlist) {
			if (!playlist.name || playlist.name == "") return;
			var name = "'" + playlist.name + "'";
			var stm = connection.run("INSERT INTO playlist(name) VALUES ("+ name +");");
			updateDatabase();
		}

		function deletePlaylist(id) {
			var stm = connection.run("DELETE FROM playlist WHERE id = " + id + ";");
			updateDatabase();
		} 

		function updatePlaylist(playlist) {
			if (!playlist.name || playlist.name == "") return;
			var name = "'" + playlist.name + "'";
			var id = playlist.id;
			var stm = connection.run("UPDATE playlist SET name = " + name + " WHERE id = " + id + ";");
			updateDatabase();
		}
	}

	// D E S I G N
	app.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default').accentPalette("indigo").primaryPalette("teal").warnPalette("pink");
	});

	app.config(function($mdIconProvider) {
	  $mdIconProvider.fontSet('md', 'material-icons');
	});
})();