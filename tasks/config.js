var package = require("../package.json");

var config = {
    projectName: "RUI",
    projectPath: "./src/",
    releasePath: "./www/",
    lessSource: "/less/",
    jsSource: "/js/",

    settings: {
        /** 每个文件输出的 banner */
        banner: {
            title: package.title,
            version: package.version
        },

        /** less */
        less: {

        },

        /** autoprefixer */
        autoprefixer: {
            browsers: [
                "last 2 version",
                "> 1%",
                "opera 12.1",
                "safari 6",
                "ie 9",
                "ie 8",
                "bb 10",
                "android 4"
            ]
        },

        /** minify-css */
        minfiy: {},

        /** rename */
        rename: {
            css: {
                extname: ".css"
            },
            minCss: {
                extname: ".min.css"
            },
            js: {
                extname: '.js'
            }
        },

        /** plumber */
        plumber: {
            errorHandler: function(err) {
                console.log(err.toString());
                this.emit("end");
            }
        }
    }
};

module.exports = config;