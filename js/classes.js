"use strict";
var Music = class Music {
	constructor(id, title, duration, droptime, killtime, bpm, artist, genre, tags) {
		this.id = id;
		this.title = title;			
		this.duration = duration;
		this.droptime = droptime;
		this.killtime = killtime;
		this.bpm = bpm;
		this.artist = artist;
		this.genre = genre;
		this.tags = tags;
	}

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

var Tag = class Tag {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	toString() {
		return this.name;
	}
}