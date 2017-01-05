"use strict";
var Music = class Music {
	constructor(id, title, duration, droptime, killtime, bpm, artist, genre) {
		this.id = id;
		this.title = title;			
		this.duration = duration;
		this.droptime = droptime;
		this.killtime = killtime;
		this.bpm = bpm;
		this.artist = artist;
		this.genre = genre;
	}

	// setId(id) { this.id = id; }
	// setTitle(title) { this.title = title; }
	// setDuration(duration) { this.duration = duration; }
	// setDroptime(droptime) { this.droptime = droptime; }
	// setKilltime(killtime) { this.killtime = killtime; }
	// setBpm(bpm) { this.bpm = bpm; }
	// setArtist(artist) { this.artist = id; }
	// setId(id) { this.id = id; }

	// getId() { return this.id; }
	// getTitle() { return this.title; }
	// getDuration() { return this.duration; }
	// getDroptime() { return this.droptime; }
	// getKilltime() { return this.killtime; }
	// getBpm() { return this.bpm; }
	// getArtist() { return this.artist; }
	// getGenre() { return this.genre; }

	getDurationFormatted() { return formatSeconds(this.duration); }
};

var Artist = class Artist {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
};

var Genre = class Genre {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
};