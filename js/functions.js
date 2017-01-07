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

function goto(local) {
	// Applies the cloak when loading
	$('.ext-content').addClass('ng-cloak');
	$("#loading").css("display", "flex");

	var file = "pages/" + local + ".html";
	$.get(file, function(data) {
	    // Get the $compile service from the app's injector
	    var injector = $('[ng-app]').injector();
	    var $compile = injector.get('$compile');

	    // Compile the HTML into a linking function...
	    var linkFn = $compile(data);
	    // ...and link it to the scope we're interested in.
	    // Here we'll use the $rootScope.
	    var $rootScope = injector.get('$rootScope');
	    var elem = linkFn($rootScope);
	    $('.ext-content').text("");
	    $('.ext-content').append(elem);

	    // Now that the content has been compiled, linked,
	    // and added to the DOM, we must trigger a digest cycle
	    // on the scope we used in order to update bindings.
	    $rootScope.$digest();

	    // Remove the cloak when finish loading all angularjs things
	    $rootScope.$$postDigest(function() {
    		$("#loading").css("display", "none");
    		$('.ext-content').removeClass('ng-cloak');
	 	});
	  }, 'html');
}