// weather.js

var weather = {};

/**
 *	Builds a API request URL.
 *
 *	@param arguments Some arguments.
 */
weather.url = function (arguments) {
	var base = "http://api.openweathermap.org/data/2.5";
	var suffix = "&units=metric&mode=json";

	// If selected by the user, use the shit imperial system.
	/*if (!settings.db.metric) {
		suffix = "&units=imperial&mode=json";
	}*/

	return base + arguments + suffix;
}

/**
 *	Searches for a location.
 *
 * @param location Search location term.
 * @param callback The usual jQuery success callback.
 */
weather.search = function (location, callback) {
	var req_url = weather.url("/find?q=" + encodeURIComponent(location));
	$.ajax({
		dataType: "jsonp",
		url: req_url,
		success: function (data) {
			callback(data);
		}
	});
}

/**
 *	Refresh the weather.
 *
 *	@param callback The usual jQuery success callback.
 */
weather.refresh = function (callback) {
	var req_url;

	if (settings.db.location.type === "id") {
		req_url = weather.url("/weather?id=" + settings.db.location.id);
	} else if (settings.db.location.type === "geolocation") {
		// TODO: Get the geolocation stuff.
		console.warn("Implement this shit");
	} else {
		console.log("Invalid location");
		alert("Invalid location");

		return null;
	}

	$.ajax({
		dataType: "jsonp",
		url: req_url,
		success: function (data) {
			callback(data);
		}
	});
}

/**
 *	Converts units to imperial crap.
 *
 *	@param data A awesome *metric* weather info object.
 *	@return The same object but full of imperial crap.
 */
weather.convert = function (data) {
	data.main.temp = ((data.main.temp * 9) / 5 + 32).toFixed(1);
	data.main.temp_min = ((data.main.temp_min * 9) / 5 + 32).toFixed(1);
	data.main.temp_max = ((data.main.temp_max * 9) / 5 + 32).toFixed(1);
	data.wind.speed = ((data.wind.speed * 9) / 5 + 32).toFixed(1);

	//return weather;
}