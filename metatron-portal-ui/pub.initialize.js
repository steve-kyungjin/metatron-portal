"use strict";
exports.__esModule = true;
var shell = require("shelljs");
shell.rm('-rf', 'src/assets/css/mp.css');
shell.rm('-rf', 'src/assets/css/mp.css.map');
shell.rm('-rf', 'src/assets/images/sprite.png');
console.log('pub resources clear. ( mp.css, mp.map.css, sprite.png )');
