// main.js

var onload = function () {
	// Setup.
	styling.load();
	action.setup();

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
	console.log("Set: " + system);
}

/**
 *	Go to a screen on the right.
 *
 *	@param from Current screen ID.
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