// Function to determine marker size based on population
function markerSize(magnitude) {
  return magnitude * 15000;
}

function markerColor(magnitude) {
  if (magnitude > 5) {
    return "Red";
  } else if (magnitude > 4) {
    return "Orange";
  } else if (magnitude > 3) {
    return "Yellow";
  } else if (magnitude > 2) {
    return "GreenYellow";
  } else if (magnitude > 1) {
    return "Green";
  } else {
    return "MediumSeaGreen";
  }
}

//load data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {
  var places = data.features.map(d => d.properties.place);
  var mags = data.features.map(d => d.properties.mag);
  var locations = data.features.map(d => [d.geometry.coordinates[1], d.geometry.coordinates[0]]);
  //console.log(locations);
  // Define arrays to hold created markers for earthquakes
  var cityMarkers = [];

  // Loop through locations and create markers dependent on mag intensity
  for (var i = 0; i < locations.length; i++) {
    cityMarkers.push(
      L.circle(locations[i], {
        stroke: false,
        fillOpacity: 0.75,
        color: markerColor(mags[i]),
        fillColor: markerColor(mags[i]),
        radius: markerSize(mags[i])
      })
    )
  };

  // console.log(cityMarkers);

  // Define variables for our base layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 5,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a layer for cities
  var cities = L.layerGroup(cityMarkers);

  // Create a baseMaps object
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlay object
  var overlayMaps = {
    "City Earthquake Magnitudes": cities
  };

  // Define a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, cities]
  });
});




// // Pass our map layers into our layer control
// // Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);