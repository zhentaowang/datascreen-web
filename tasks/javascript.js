"use strict";

var config = require("./config");
var settings = config.settings;

var uglify = require('gulp-uglify');
var clone = require("gulp-clone");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");

var transport = require("gulp-seajs-transport");

var gulp = require("gulp");

var ac = require('./copyright');

// module.exports = function(callback){
// 	var stream, uncompressStream, compressStream;
// 	var distPath = config.releasePath + "/js";
// 	var srcPath = config.projectPath + config.jsSource + "*.js";

// 	stream = gulp.src(srcPath)
// 		.pipe(plumber(settings.plumber))
// 		.pipe(uglify())

// 	compressStream = stream.pipe(rename(settings.rename.js))
// 		.pipe(gulp.dest(distPath))
// 		.on("end", callback);
// };
var projectPath = config.releasePath;
// console.log(projectPath);
// gulp.task("js",
module.exports = function(callback) {
	var stream, uncompressStream, compressStream;

	gulp.src(["src/js/**/*.js", "!src/js/directives.js"])
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.toString());
				this.emit("end");
			}
		}))
		//.pipe(transport())
		.pipe(uglify({
			preserverComments: !true,
			ascii_only: true,
		}))
		.pipe(ac())
		.pipe(gulp.dest(projectPath + "js/"));

	gulp.src("src/js/directives.js")
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.toString());
				this.emit("end");
			}
		}))
		.pipe(ac())
		.pipe(gulp.dest(projectPath + "js/"))
		.on("end", callback);
};