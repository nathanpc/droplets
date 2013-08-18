// listing.js

var listing = {};

/**
 *	Populate locations in the list.
 *
 *	@param locations The array with the locations.
 */
listing.populate_locations = function (locations) {
	listing.clear_locations();

	for (var i = 0; i < locations.length; i++) {
		var location = locations[i];
		var name = location.name + ", " + location.sys.country;

		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute("href", "#");
		a.setAttribute("id", i);
		a.onclick = function () {
			console.log("Selected location: " + locations[this.id].id);

			// Do the settings stuff.
			settings.db.location.type = "id";
			settings.db.location.id = locations[this.id].id;
			settings.save();

			// Go back and refresh.
			action.pop_screen();
			action.refresh();
		}

		var p = document.createElement("p");
		p.innerHTML = name;

		a.appendChild(p);
		li.appendChild(a);

		$("#location-search-list").append(li);
	}
}

/**
 *	Clear the location list.
 */
listing.clear_locations = function () {
	$("#location-search-list").html("");

	var li = document.createElement("li");
	var a = document.createElement("a");
	a.setAttribute("href", "#");
	a.onclick = function () {
		console.log("Set to use Geolocation");

		// Do the settings stuff.
		settings.db.location.type = "geolocation";
		settings.save();

		// Go back and refresh.
		action.pop_screen();
		action.refresh();
	};

	var p = document.createElement("p");
	p.innerHTML = "Use Geolocation";

	a.appendChild(p);
	li.appendChild(a);

	$("#location-search-list").append(li);
}

/**
 *	Populate the forecast list.
 */
listing.populate_forecast = function () {
	var forecasts = JSON.parse(JSON.stringify(current_forecasts_data.list));
	$(".forecast-container > ul").html("");

	for (var i = 0; i < forecasts.length; i++) {
		var forecast = forecasts[i];

		// If the user selected, convert to imperial.
		var symbol = " °C";
		if (!settings.db.metric) {
			forecast.temp.min = weather.convert(forecast.temp.min);
			forecast.temp.max = weather.convert(forecast.temp.max);

			symbol = " °F";
		}

		// Item.
		var li = document.createElement("li");
		li.setAttribute("class", "forecast");

		// Date.
		var date = document.createElement("div");
		date.setAttribute("class", "date");

		var week = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
		var date_obj = new Date();
		date_obj.setDate(date_obj.getDate() + 1 + i);
		date.innerHTML = week[date_obj.getDay()];

		// Weather icon.
		var img = document.createElement("img");
		img.src = "assets/weather/00.png";

		// Min.
		var min = document.createElement("div");
		min.setAttribute("class", "minmax min");
		min.innerHTML = forecast.temp.min + symbol;

		// Max.
		var max = document.createElement("div");
		max.setAttribute("class", "minmax max");
		max.innerHTML = forecast.temp.max + symbol;

		li.appendChild(date);
		li.appendChild(img);
		li.appendChild(min);
		li.appendChild(max);

		$(".forecast-container > ul").append(li);
	}
}