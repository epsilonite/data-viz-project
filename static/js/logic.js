
//----------------------------------------------------------------------//
// GLOBALS
//----------------------------------------------------------------------//
// Set list of colors for map
const colors = ['fbc127','f57d15','d44843','9f2a63','65156e','280b54']
// Set URL to estract geojson
const geojson = 'static/data/iucn/iucn_points.geojson';
// Set initial zoom
const initZoom = 4;
//----------------------------------------------------------------------//
// FETCH DATA THEN RUN APP
//----------------------------------------------------------------------//
// Get the data with d3.
d3.json(geojson).then(function(data) {
  console.log(data);
  // let dL = JSON.parse(JSON.stringify(data.features));
  // let dR = JSON.parse(JSON.stringify(data.features));
  // dL.forEach(f => f.geometry.coordinates[0]+=360);
  // dR.forEach(f => f.geometry.coordinates[0]-=360);
  // let bioFeatures = data.features.concat(dL,dR).sort((x,y)=>d3.ascending(y.properties.event_year,x.properties.event_year));
  createMap(data.features);
});

//----------------------------------------------------------------------//
// FUNCTIONS
//----------------------------------------------------------------------//

//----------------------------------------------------------------------//
// Create map
function createMap(features) {
  let bounds = new L.LatLngBounds(new L.LatLng(-90, -360), new L.LatLng(90, 360));
  let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 2,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
  var street = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 2,
    maxZoom: 22,
    accessToken: ' m5Y4FMaF1cDbNvJ2BRVZfIW68vIcw3Ve3nM9d28vh1uSeckwb0QriuvQ5hsAnSLT'
  });
  var gray = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    minZoom: 2,
    maxZoom: 16
  });
  var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    minZoom: 2,
    maxZoom: 13
  });

  let baseMaps = {
    "Street Map": street,
    "Minimal Map": gray,
    "Terrain Map": terrain,
    "Satelite Map": satellite,
  };

  let overlayMaps = {
    "Endangered": species,
  };

  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: initZoom,
    layers: [gray, species],
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
  });

  let heatArray=[]
  features.forEach(feature => {if (feature.geometry) heatArray.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);})

  let heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

  // Create a layer control, pass it our baseMaps and overlayMaps,
  // then add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

  // Send map to createLegend function
  createLegend(myMap);
}

//----------------------------------------------------------------------//
// Create legend
function createLegend(map) {
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend leaflet-control-layers leaflet-control-layers-expanded");
    let range = ['Extant (resident)','Extant & Vagrant (resident)','Possibly Extant (resident)','Possibly Extinct','Possibly Extinct & Vagrant'];
    div.innerHTML = '<b>Legend</b><br>'
    // Loop through the ranges and generate a label with a colored square for each interval
    for (let i = 0; i < range.length; i++) {
      div.innerHTML += `<i style="background-color:#${colors[i]};"></i>${range[i]} `
          + (range[i+1] ? '<br>' : '');
    }
    return div;
  };
  // Adding the legend to the map
  legend.addTo(map);
}
//----------------------------------------------------------------------//
// function to calculate radius
function calculateRadius(year, zoom) {
  const transformedYear = Math.sqrt(year);
  if (zoom>10) return 2**(zoom-11)*transformedYear;
  if (zoom>initZoom) return transformedYear;
  return 2**(zoom-initZoom)*transformedYear;
}