//----------------------------------------------------------------------//
// GLOBALS
//----------------------------------------------------------------------//
// Set list of properties
const landuse = ['Cropland','Permanent meadows and pastures',
  'Forest land','Other land', 'Farm buildings and Farmyards','Unaccounted']
const items = ['Rice', 'Cattle and Buffaloes', 'Soya beans', 'Cocoa beans',
  'Coffee, green', 'Oil palm fruit', 'Green corn/Maize']
// Set list of colors for map
const colors = ['fbc127','f57d15','d44843','9f2a63','65156e','280b54']
//----------------------------------------------------------------------//
// MAP GLOBALS
//----------------------------------------------------------------------//
// Set initial zoom
const initZoom = 2;
const bounds = new L.LatLngBounds(new L.LatLng(-90,-360), new L.LatLng(90,360));
// Set Tiles
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  minZoom: 2,
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
const gray = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  minZoom: 2,
  maxZoom: 16
});
const terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  minZoom: 2,
  maxZoom: 13
});
// Create our map, giving it the streetmap and earthquakes layers to display on load.
let map = L.map("map", {
  center: [37, 0],
  zoom: initZoom,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
});
// Create a baseMaps object.
const baseMaps = {
  "Minimal Map": gray,
  "Terrain Map": terrain,
  "Satelite Map" : satellite,
}
// Set base layer control to map
L.control.layers(baseMaps).addTo(map);
//----------------------------------------------------------------------//
// FETCH DATA THEN RUN APP
//----------------------------------------------------------------------//
// Get the data with d3.


  let world = L.choropleth(data , {
    // Define which property in the features to use.
    valueProperty:'landuse[2].values[-1]',
    // Set the color scale.
    scale: ['#fff','#444'],
    // The number of breaks in the step range
    steps: 12,
    // q for quartile, e for equidistant, k for k-means
    mode: 'q',
    style: {
      color:'#fff',
      weight:1,
      fillOpacity:1
    },
    // Binding a popup to each layer
    onEachFeature: function(feature,layer) {
      layer.bindPopup('<strong>'+feature.properties.name+':</strong> '+feature.properties.landarea+'1000 ha')
    }
  }).addTo(map);



// control that shows state info on hover
var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

info.update = function(props) {
  this._div.innerHTML =
    "<h4>US Population Density</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        props.density +
        " people / mi<sup>2</sup>"
      : "Hover over a state");
};

info.addTo(map);

// get color depending on population density value
function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
      ? "#BD0026"
      : d > 200
        ? "#E31A1C"
        : d > 100
          ? "#FC4E2A"
          : d > 50
            ? "#FD8D3C"
            : d > 20 ? "#FEB24C" : d > 10 ? "#FED976" : "#FFEDA0";
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}
let dL = JSON.parse(JSON.stringify(data.features));
let dR = JSON.parse(JSON.stringify(data.features));
dL.forEach(f => f.geometry.coordinates[0]+=360);
dR.forEach(f => f.geometry.coordinates[0]-=360);
let datafeatures = data.features.concat(dL,dR);
geojson = L.geoJson(datafeatures, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution(
  'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [],
    from,
    to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' +
        getColor(from + 1) +
        '"></i> ' +
        from +
        (to ? "&ndash;" + to : "+")
    );
  }

  div.innerHTML = labels.join("<br>");
  return div;
};

legend.addTo(map);