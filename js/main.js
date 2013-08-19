// main.js

// A global variable because we all love them.
var current_weather_data = null;
var current_forecasts_data = null;

var onload = function () {
	// Setup styling stuff.
	settings.load();
	styling.load();
	loading.hide();

	// Setup other stuff.
	action.setup();
	listing.clear_locations();

	action.refresh();
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
	loading.show();

	weather.refresh(function (data) {
		current_weather_data = data;
		styling.populate_weather_info();

		loading.hide();
	});

	weather.forecasts(function (data) {
		current_forecasts_data = data;
		listing.populate_forecast();
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
	listing.populate_forecast();
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
	var main_center = ($(window).height() / 2) - 65;
	// Center the main weather thingy.
	$("#weather-center").css("padding-top",
		main_center - ($("#weather-center").height() + $("footer.forecast-container").height() + 50) / 2 + "px");

	// Center the loading thingy.
	$("#loading").css("top", main_center - ($("#loading").height() / 2));

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
		weather_info.main.temp = weather.convert(weather_info.main.temp);
		weather_info.main.temp_min = weather.convert(weather_info.main.temp_min);
		weather_info.main.temp_max = weather.convert(weather_info.main.temp_max);

		symbol = {
			temperature: " °F",
			speed: " mph"
		};
	} else {
		// Convert the wind speed from mph to km/h.
		weather_info.wind.speed = (weather_info.wind.speed * 0.621371192).toFixed(1);
	}

	// Weather.
	$("#big-container > .img-container > img").attr("src", weather.icon(weather_info.weather[0].id));
	$(".temp-container > .location").html(weather_info.name);
	$(".temp-container > .description").html(weather_info.weather[0].description);
	$(".temp-container > .temp").html(Math.round(weather_info.main.temp) + symbol.temperature);
	$(".temp-container > .minmax-container > .minmax.min").html(Math.round(weather_info.main.temp_min) + symbol.temperature);
	$(".temp-container > .minmax-container > .minmax.max").html(Math.round(weather_info.main.temp_max) + symbol.temperature);

	// More info.
	$(".more-info .humidity").html(weather_info.main.humidity + "%");
	$(".more-info .cloudiness").html(weather_info.clouds.all + "%");
	$(".more-info .wind-speed").html(Number(weather_info.wind.speed).toFixed(1) + symbol.speed);
	$(".more-info .wind-direction").html(Math.round(weather_info.wind.deg) + "°");
}


var loading = {};

/**
 *	Show the loading indicator.
 */
loading.show = function () {
	$("#weather-center").hide();
	$(".forecast-container").hide();

	$("#loading").show();
}

/**
 *	Hides the loading indicator.
 */
loading.hide = function () {
	$("#loading").hide();

	$("#weather-center").show();
	$(".forecast-container").show();
}