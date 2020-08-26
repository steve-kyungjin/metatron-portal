"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var moment = require("moment");
var targetPath = "build-timestamp.json";
var buildTimeStampJsonFile = "{\n  \"date\": \"" + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + "\"\n}";
fs_1.writeFile(targetPath, buildTimeStampJsonFile, function (err) {
    if (err) {
        console.log(err);
    }
});
