"use strict";
exports.__esModule = true;
var shell = require("shelljs");
var OS = require("os");
if (OS.type() === 'Windows_NT') {
	shell['exec']('node node_modules\\grunt-cli\\bin\\grunt --gruntfile html.gruntfile.js watch');
}
else {
	shell['exec']('node_modules/grunt-cli/bin/grunt --gruntfile html.gruntfile.js watch');
}
