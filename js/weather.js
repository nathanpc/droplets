// weather.js

var weather = {};

weather.url = function (arguments) {
	var base = "http://api.openweathermap.org/data/2.5/";
	var suffix = "&units=metric&mode=json";

	return base + arguments + suffix;
}

weather.search = function (location, callback) {
	var req_url = weather.url("find?q=" + encodeURIComponent(location));
	$.ajax({
		dataType: "jsonp",
		url: req_url,
		success: function (data) {
			callback(data);
		}
	});
}