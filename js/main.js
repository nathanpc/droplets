// main.js

var onload = function () {
	// Setup.
	styling.load();
	action.units_dialog("setup");

	// TODO: The wind speed is always in mph convert it to km/h if metric is selected.
}


var action = {};

/**
 *	Sets up some event handlers.
 */
action.setup = function () {
	document.querySelector('#btn-headers').addEventListener ('click', function () {
  		document.querySelector('#headers').className = 'current';
  		document.querySelector('[data-position="current"]').className = 'left';
	});

	document.querySelector('#btn-headers-back').addEventListener ('click', function () {
		document.querySelector('#headers').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
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
action.push_screen = function (from, to) {
	//
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