
// // Define json 
// const json = d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');

// // Function to run on page load
// function init() {
//   json.then( data => {
//     data.names.forEach( // Loop through data.names (list of sample names)
//       id => d3.select('#selDataset').append('option').attr('value',id).html(id));
//     // append a new option for each sample name inside #selDataset
//     let sample = d3.select('#selDataset').property("value"); // Get the first sample from the list
//     // Build charts and metadata panel with the first sample
//     buildCharts(sample,data);
//     buildMetadata(sample,data);
//   });
// }

// // Build the metadata panel
// function buildMetadata(id,data) {
//   // filter data.metadata for given sample number
//   let metadata = data.metadata.filter(row => row.id==id)[0];
//   // Use d3 to select `#sample-metadata` and reset the html
//   d3.select("#sample-metadata").html('');
//   // Loop through metadata (dictionary) use d3 to select `#sample-metadata` and append `key: value`s
//   Object.entries(metadata).forEach(
//     ([key,value]) => d3.select("#sample-metadata").append('p').html(`<span>${key.toUpperCase()}:</span> ${value}`));
// }

// // Function to build both charts
// function buildCharts(id,data) {
//     // Filter the samples for the object with the desired sample number
//     let sampleData = data.samples.filter(row => row.id==id)[0];
//     // console.log(sampleData);

//     // Set config to be responsive
//     let config = {responsive: true};

//     // Build a Bubble Chart
//     let traceBubble = {
//       x: sampleData.otu_ids,
//       y: sampleData.sample_values,
//       text: sampleData.otu_labels.map(str => str.replaceAll(';','<br>')),
//       mode: 'markers',
//       marker: {color: sampleData.otu_ids, size: sampleData.sample_values, colorscale:"Portland", cmin:2, cmax:3663 }
//     };
//     let dataBubble = [traceBubble];
//     let layoutBubble = {
//       title: 'Bacteria Cultures Per Sample',
//       showlegend: false,
//       xaxis: {title:{text:'OTU ID'}},
//       yaxis: {title:{text:'Number of Bacteria'}}
//     };
//     // Render the Bubble Chart
//     Plotly.newPlot('bubble', dataBubble, layoutBubble, config);

//     // Build a Bar Chart
//     let barData = buildBarData(sampleData);
//     let traceBar = {
//       x: barData.map(row => row.sample_values),
//       y: barData.map(row => `OTU ${row.otu_ids} `),
//       text: (barData.map(row => row.otu_labels).map(str => str.replaceAll(';','<br>'))),
//       name: "Bacteria Cultures",
//       type: "bar",
//       orientation: "h",
//       marker: { color: barData.map(row => row.otu_ids), colorscale:"Portland", cmin:2, cmax:3663 }
//     };
//     // Data array
//     let dataBar = [traceBar];
//     let layoutBar = {
//       title: "Top 10 Bacteria Cultures Found",
//       xaxis: {title:{text:'Number of Bacteria'}},
//       margin: {l: 100, r: 100, t: 100, b: 100}
//     };
//     // Render the Bar Chart
//     Plotly.newPlot('bar', dataBar, layoutBar, config);
// }

// // Function to slice sample data for bar chart
// function buildBarData(sampleData) {
//   let sampleDict = [];
//   sampleData.otu_ids.forEach(id => {
//     let i = sampleData.otu_ids.indexOf(id);
//     let dict = {
//       otu_ids: id,
//       otu_labels: sampleData.otu_labels[i],
//       sample_values: sampleData.sample_values[i]
//     };
//     sampleDict.push(dict);
//   });
//   let slice = sampleDict.sort((x1,x2) => x2.sample_values-x1.sample_values).slice(0,10).reverse();
//   return slice;s
// }

// // Function for event listener
// function optionChanged(newSample) {
//   json.then( data => {
//     // Build charts and metadata panel each time a new sample is selected
//     let newData = data.samples.filter(row => row.id==newSample)[0];
//     // Redraw Bubble Chart
//     Plotly.restyle("bubble", 'x', [newData.otu_ids]);
//     Plotly.restyle("bubble", 'y', [newData.sample_values]);
//     Plotly.restyle("bubble", 'text', [newData.otu_labels.map(str => str.replaceAll(';','<br>'))]);
//     Plotly.restyle("bubble", 'marker', [{ color: newData.otu_ids, size: newData.sample_values, colorscale:"Portland", cmin:2, cmax:3663 }]);
//     // Redraw Bar Charts
//     let barData = buildBarData(newData);
//     Plotly.restyle("bar", "x", [barData.map(row => row.sample_values)]);
//     Plotly.restyle("bar", "y", [barData.map(row => `OTU ${row.otu_ids} `)]);
//     Plotly.restyle("bar", "text", [(barData.map(row => row.otu_labels).map(str => str.replaceAll(';','<br>')))]);
//     Plotly.restyle("bar", 'marker', [{ color: barData.map(row => row.otu_ids), colorscale:"Portland", cmin:2, cmax:3663 }]);
//     //Update metadata
//     buildMetadata(newSample,data);
//   });
// }

// // Initialize the dashboard
// init();





//----------------------------------------------------------------------//
// GLOBALS
//----------------------------------------------------------------------//
// Set list of colors for map
const colors = ['fbc127','f57d15','d44843','9f2a63','65156e','280b54']
// Set URL to estract geojson
// let geojson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const geojson = 'static/data/iucn/iucn_geometry.geojson';
// Set initial zoom
const initZoom = 4;
//----------------------------------------------------------------------//
// FETCH DATA THEN RUN APP
//----------------------------------------------------------------------//
// Get the data with d3.
d3.json(geojson).then(function(data) {
  console.log(data);
  let dL = JSON.parse(JSON.stringify(data.features));
  let dR = JSON.parse(JSON.stringify(data.features));
  dL.forEach(f => f.geometry.coordinates[0]+=360);
  dR.forEach(f => f.geometry.coordinates[0]-=360);
  let bioFeatures = data.features.concat(dL,dR).sort((x,y)=>d3.ascending(y.properties.event_year,x.properties.event_year));
  createFeatures(bioFeatures);
});

//----------------------------------------------------------------------//
// FUNCTIONS
//----------------------------------------------------------------------//
function createFeatures(speciesData) {
  // function to assign colors
  function getColor(legend) {
    if (legend=='Extant (resident)') return colors[0];
    else if (legend=='Extant & Vagrant (resident)') return colors[1];
    else if (legend=='Possibly Extant (resident)') return colors[2];
    else if (legend=='Possibly Extinct') return colors[3];
    else if (legend=='Possibly Extinct & Vagrant') return colors[4];
    else return colors[5];
  }
  // array to store markers
  let circleMarkers = []
  // function to create circles
  function createCircles(feature, latlng) {
    const marker = L.circleMarker(latlng, {
      color: `#${getColor(feature.properties.legend)}`,
      radius: calculateRadius(feature.properties.year,initZoom),
      fillOpacity: 0.4,
      weight: 1,
    });
    marker.mag = feature.properties.mag;
    circleMarkers.push(marker);
    return marker;
  }
  // function to bind popup to each geojson feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h1>M${feature.properties.sci_name}</h1><h4>${feature.properties.legend}</h4><p>Averge year of reported sighting: ${feature.properties.event_year}</p>`,
    { className:`popup-${getColor(feature.properties.legend)}`});
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let species = L.geoJSON(speciesData, {
    pointToLayer: createCircles,
    onEachFeature: onEachFeature
  });
  // Send our earthquakes layer to the createMap function
  createMap(species,circleMarkers);
}
//----------------------------------------------------------------------//
// Create map
function createMap(species,circleMarkers) {
  // Create the base layers.
  let bounds = new L.LatLngBounds(new L.LatLng(-90,-360), new L.LatLng(90,360));
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
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Minimal Map": gray,
    "Terrain Map": terrain,
    "Satelite Map" : satellite,
  }
  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    "Endangered": species,
  }
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: initZoom,
    layers: [gray, species],
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
  });
  myMap.on('zoomend', function() {             
    var currentZoom = myMap.getZoom();
    console.log(currentZoom);
    circleMarkers.forEach(marker=>marker.setRadius(calculateRadius(marker.year,currentZoom-1)));
  });
  // Create a layer control, pass it our baseMaps and overlayMaps,
  // then add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);
  // Send map to createLegend function
  createLegend(myMap);
}
//----------------------------------------------------------------------//
// Create legend
function createLegend(map) {
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend leaflet-control-layers leaflet-control-layers-expanded");
    let range = [-10, 10, 30, 50, 70, 90];
    div.innerHTML = '<b>Depth Legend</b><br>'
    // Loop through the ranges and generate a label with a colored square for each interval
    for (let i = 0; i < range.length; i++) {
      div.innerHTML += `<i style="background-color:#${colors[i]};"></i>${range[i]} `
          + (range[i+1] ? '&ndash; '+range[i + 1]+' km<br>' : '+'+' km');
    }
    return div;
  };
  // Adding the legend to the map
  legend.addTo(map);
}
//----------------------------------------------------------------------//
// function to calculate radius
function calculateRadius(magnitude, zoom) {
  const transformedMagnitude = Math.sqrt(2.5**(magnitude+2));
  if (zoom>10) return 2**(zoom-11)*transformedMagnitude
  if (zoom>initZoom) return transformedMagnitude; // sqrt(ln(M + 1))
  return 2**(zoom-initZoom)*transformedMagnitude; // sqrt(ln(M + 1))
}