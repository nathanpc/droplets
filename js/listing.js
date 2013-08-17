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
		a.setAttribute("onclick", "console.log(" + location.id + ");");

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
		console.log("GEOLOCATE!!!");
	};

	var p = document.createElement("p");
	p.innerHTML = "Use Geolocation";

	a.appendChild(p);
	li.appendChild(a);

	$("#location-search-list").append(li);
}