module.exports = function (ratio) {
	var distFileName = 'sprite';

	return {
		cssFormat: 'scss',
		imgPath: '../images/' + distFileName + '.png',
		cssTemplate: 'client/sass/_sprite/sprite' + ratio + '.scss.mustache',
		src: 'client/sprite/*.png',
		dest: 'client/images/' + distFileName + '.png',
		destCss: 'client/sass/import/common/sprite.scss',
		padding: 4
	};
}
