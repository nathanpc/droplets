// main.js

var onload = function () {
	// TODO: Vertically venter the big weather thingy.
	fix_scrolling_width();
}

var fix_scrolling_width = function () {
	$("footer.forecast-container").css("width", $(window).width());
}