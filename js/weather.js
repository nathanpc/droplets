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
		$.ajax({
			dataType: "jsonp",
			url: req_url,
			success: function (data) {
				callback(data);
			}
		});
	} else if (settings.db.location.type === "geolocation") {
		weather.geolocation(function (geo) {
			req_url = weather.url("/weather?lat=" + geo.lat + "&lon=" + geo.lng);

			$.ajax({
				dataType: "jsonp",
				url: req_url,
				success: function (data) {
					callback(data);
				}
			});
		});
	} else {
		console.log("Invalid location");
		alert("Invalid location");

		return null;
	}
}

/**
 * Gets the forecast.
 *
 *	@param callback The usual jQuery success callback.
 */
weather.forecasts = function (callback) {
	var req_url;

	if (settings.db.location.type === "id") {
		req_url = weather.url("/forecast/daily?id=" + settings.db.location.id);
		$.ajax({
			dataType: "jsonp",
			url: req_url,
			success: function (data) {
				callback(data);
			}
		});
	} else if (settings.db.location.type === "geolocation") {
		weather.geolocation(function (geo) {
			req_url = weather.url("/forecast/daily?lat=" + geo.lat + "&lon=" + geo.lng);

			$.ajax({
				dataType: "jsonp",
				url: req_url,
				success: function (data) {
					callback(data);
				}
			});
		});
	} else {
		console.log("Invalid location");
		alert("Invalid location");

		return null;
	}
}

/**
 *	Gets the user geolocation.
 *
 *	@param callback A JSON with the latitude and longitude.
 */
weather.geolocation = function (callback) {
	navigator.geolocation.getCurrentPosition(function (geo, err) {
		if (err !== undefined) {
			if (err.code === 1) {
				// Denied.
				console.warn("User denied the geolocation request");
				console.log(err);

				return alert("Looks like you don't want this app to know your location, please open the menu and manually select your location");
			} else if (err.code === 2) {
				// Position unavailable.
				console.warn("User geolocation position was unavailable");
				console.log(err);

				return alert("Looks like your device couldn't locate you. Please try again later");
			} else if (err.code === 1) {
				// Timeout.
				console.warn("Geolocation timedout");
				console.log(err);

				return alert("Looks like it took too long for your device to locate you. Please try again later");
			}
		}

		callback({
			lat: geo.coords.latitude,
			lng: geo.coords.longitude
		});
	});
}

/**
 *	Converts units to imperial crap.
 *
 *	@param data A awesome *metric* temperature.
 *	@returns The temperature in the imperial system.
 */
weather.convert = function (data) {
	var temp = Math.round((data * 9) / 5 + 32);
	return temp;
}

/**
 *	Gets the correct icon for the current weather. More info: http://bit.ly/XFOlDt
 *
 *	@param code Weather code.
 *	@return A image path.
 */
weather.icon = function (code) {
	if (code >= 200 && code < 300) {
		// Thunderstorm.
		return "assets/weather/00.png";
	} else if (code >= 300 && code < 400) {
		// Drizzle.
		return "assets/weather/01.png";
	} else if (code >= 500 && code < 600) {
		// Rain.
		if (code == 500) {
			return "assets/weather/09.png";
		} else if (code == 511) {
			return "assets/weather/05.png";
		}

		return "assets/weather/12.png";
	} else if (code >= 600 && code < 700) {
		// Snow.
		if (code == 600) {
			return "assets/weather/13.png";
		} else if (code == 601) {
			return "assets/weather/14.png";
		}

		return "assets/weather/16.png";
	} else if (code >= 700 && code < 800) {
		// Atmosphere.
		return "assets/weather/20.png";
	} else if (code >= 800 && code < 900) {
		// Clouds.
		// TODO: Implement night detection.
		if (code == 800) {
			return "assets/weather/32.png";
		} else if (code == 801) {
			return "assets/weather/34.png";
		} else if (code == 802) {
			return "assets/weather/30.png";
		} else if (code == 804) {
			return "assets/weather/26.png";
		}

		return "assets/weather/28.png";
	}

	return "assets/weather/25.png";
}