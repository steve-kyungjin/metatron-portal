"use strict";
exports.__esModule = true;
var shell = require("shelljs");
var OS = require("os");
if (OS.type() === 'Windows_NT') {
	shell['exec']('cd ..\\metatron-portal-pub && npm run ui:build && cd ..\\metatron-portal-ui');
}
else {
	shell['exec']('cd ../metatron-portal-pub && npm run ui:build && cd ../metatron-portal-ui');
}
