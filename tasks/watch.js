"use strict";

var config = require("./config");
var cssTask = require("./less");
var jsTask = require('./javascript');

var gulp = require("gulp");

module.exports = function(callback){
	var lessSources = config.projectPath + config.lessSource + "**/*.less";
	var jsSources = config.projectPath + config.jsSource + "**/*.js";

	gulp.watch(lessSources, function(file){
		gulp.start("less", cssTask);
	});

	gulp.watch(jsSources, function(file){
		gulp.start('javascript', jsTask);
	});
};