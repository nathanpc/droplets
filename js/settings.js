// settings.js
// Set ALL the things!

var settings = {};
settings.db = {};

/**
 *	Loads the settings into the variable.
 */
settings.load = function () {
	var local = localStorage.getItem("Droplets-Settings");

	if (local === null) {
		settings.db = {
			metric: true,
			location: {
				type: "geolocation",
				id: null
			}
		};

		settings.save();
	} else {
		settings.db = JSON.parse(local);
	}
}

/**
 *	Save the settings.
 */
settings.save = function () {
	localStorage.setItem("Droplets-Settings", JSON.stringify(settings.db));
}