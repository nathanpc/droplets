// listing.js

var listing = {};

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