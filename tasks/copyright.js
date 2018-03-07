var pkg = require('../package.json');

var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var through = require("through2");
var path = require("path");
var util = require("util");

//add copyright
var ac = function(file){
	file.contents = new Buffer(pkg.copyright + file.contents.toString())
};

module.exports = function(){
	var stream = through.obj(function (file, enc, cb){
		if(file.isBuffer()){
			ac(file);
			this.push(file);
			return cb();
		}
		else{
			gutil.log(gutil.colors.cyan('warning:'), "there's something wrong with the file");
		}
		return cb();
	});
	return stream;
}