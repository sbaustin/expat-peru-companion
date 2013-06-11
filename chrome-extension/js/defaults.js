var pluginData = {normalizertext: 'normalized', fullWidth: false, imagefix: true, colors: {postTitle: '#000000', evenRow:'transparent', oddRow:'trasparent'}};

var iconPath = function(img){
	return imgPath("icons/" + img)
}

var imgPath = function(img) {
	return chrome.extension.getURL("/img/" + img);
}