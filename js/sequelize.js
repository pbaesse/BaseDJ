var path = require('path');
var fs = require('fs');
var sql = require('sql.js');
var bfr = fs.readFileSync(path.resolve(__dirname, 'database', 'database.db'));
var db = new sql.Database(bfr);

