"use strict";

var gulp = require("gulp");
var cssTask = require("./tasks/less");
var watchTask = require("./tasks/watch");
var jsTask  = require('./tasks/javascript');

gulp.task("less", cssTask);
gulp.task("javascript", jsTask);

gulp.task("watch", watchTask);

gulp.task('init', ['less', 'javascript']);
gulp.task('default', ['watch']);