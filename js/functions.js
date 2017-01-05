var database, fs, path;

function initDatabase() {
	path = require('path');
	fs = require('fs');
	var SQL = require('sql.js');
	var bfr = fs.readFileSync(path.resolve(__dirname, 'database', 'database.db'));
	database = new SQL.Database(bfr);
}

function updateDatabase() {
	var data = database.export();
	var buffer = new Buffer(data);
	fs.writeFileSync(path.resolve(__dirname, 'database', 'database.db'), buffer);
}

function formatSeconds(seconds) {
	var minutes = 0;

	if (seconds >= 60) {
		minutes = Math.floor(seconds/60);
	}

	var remainSecs = seconds % 60;

	minutes = (minutes < 10 ? "0" : "") + minutes;
	remainSecs = (remainSecs < 10 ? "0" : "") + remainSecs;
	return minutes  + ":" + remainSecs;
}