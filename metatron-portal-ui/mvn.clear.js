"use strict";
exports.__esModule = true;
var shell = require("shelljs");
shell['exec']('node node.rm.js && node etc.rm.js && node target.rm.js');
