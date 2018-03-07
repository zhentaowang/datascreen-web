var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname))); //路径在主目录下。
//下面文件夹为path.join(__dirname,'view')

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log("start in " + app.get('port'));
});

module.exports = app;
