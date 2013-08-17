// main.js

// A global variable because we all love them.
var current_weather_data = null;

var onload = function () {
	// Setup.
	settings.load();
	styling.load();
	action.setup();
	listing.clear_locations();

	action.refresh();

	// TODO: The wind speed is always in mph convert it to km/h if metric is selected.
}


var action = {};

/**
 *	Sets up some event handlers.
 */
action.setup = function () {
	// Dialog.
	action.units_dialog("setup");

	// Back buttons.
	$("#btn-set-location-back").click(function (event) {
		action.pop_screen();
	});

	// Inputs.
	$("#location-input").keypress(function (event) {
		if (event.which == 13) {
			weather.search(this.value, function (data) {
				listing.populate_locations(data.list);
			});

			return false;
		}
	});
}

/**
 *	Refreshes the weather information.
 */
action.refresh = function () {
	// TODO: Show some refreshing thingy.

	weather.refresh(function (data) {
		current_weather_data = data;
		styling.populate_weather_info();
	});
}

/**
 *	Action handlers for the unit selection dialog.
 *
 *	@param act Action string.
 */
action.units_dialog = function (act) {
	if (act === "open") {
		// Open.
		$("#units-dialog").removeClass("fade-out");
		$("#units-dialog").addClass("fade-in");
	} else if (act === "close") {
		// Close.
		$("#units-dialog").removeClass("fade-in");
		$("#units-dialog").addClass("fade-out");
	} else if (act === "setup") {
		// Setup.
		$("#units-dialog button").click(function (event) {
			action.set_unit_system(this.innerHTML);
		});
	} else {
		console.warn("WTF have you selected?");
	}
}

/**
 *	Sets the unit system used in the application.
 *
 *	@param system Name of the system.
 */
action.set_unit_system = function (system) {
	console.log("Set unit system: " + system);
	system = system.toLowerCase();

	if (system === "imperial") {
		settings.db.metric = false;
	} else {
		settings.db.metric = true;
	}

	settings.save();
	styling.populate_weather_info();
}

/**
 *	Go to a screen on the right.
 *
 *	@param to Next screen ID.
 */
action.push_screen = function (to) {
	console.log("Push screen: " + to);

	document.querySelector("#" + to).className = "current";
	document.querySelector("[data-position=\"current\"]").className = "left";
}

/**
 *	Pops the current screen.
 */
action.pop_screen = function () {
	console.log("Pop screen");

	document.querySelector("section[role=\"region\"].current").className = "right";
	document.querySelector("[data-position=\"current\"]").className = "current";
}


var styling = {};

/**
 *	The onload styling stuff.
 */
styling.load = function () {
	// Center the main weather thingy.
	$("#weather-center").css("padding-top",
		($(window).height() / 2) - 25 - ($("#weather-center").height() + $("footer.forecast-container").height() + 50) / 2 + "px");

	// Fixes the forecast scrolling.
	$("footer.forecast-container").css("width", $(window).width());
}

/**
 *	Populate the weather information.
 */
styling.populate_weather_info = function () {
	var weather_info = JSON.parse(JSON.stringify(current_weather_data));
	if (current_weather_data === null) {
		return;
	}

	var symbol = {
		temperature: " °C",
		speed: " km/h"
	};

	// If the user selected, convert to imperial.
	if (!settings.db.metric) {
		//weather_info = weather.convert(weather_info);
		weather.convert(weather_info);
		symbol = {
			temperature: " °F",
			speed: " mph"
		};
	}

	// Weather.
	$(".temp-container > .location").html(weather_info.name);
	$(".temp-container > .temp").html(weather_info.main.temp + symbol.temperature);
	$(".temp-container > .minmax-container > .minmax.min").html(weather_info.main.temp_min + symbol.temperature);
	$(".temp-container > .minmax-container > .minmax.max").html(weather_info.main.temp_max + symbol.temperature);

	// More info.
	$(".more-info .humidity").html(weather_info.main.humidity + "%");
	$(".more-info .cloudiness").html(weather_info.clouds.all + "%");
	$(".more-info .wind-speed").html(weather_info.wind.speed + symbol.speed);
	$(".more-info .wind-direction").html(weather_info.wind.deg + "°");

	// TODO: Call the listing.populate_forecast() thingy.
}