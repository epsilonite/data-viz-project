//
const geojsonData = 'static/data/geojson/merged.geojson';

// Item select arrays
const landuse = ['Agricultural','Cropland','Permanent meadows and pastures','Farm buildings and Farmyards','Forest land','Other land','Unaccounted'];
const agriculture = ['Cropland','Permanent meadows and pastures','Farm buildings and Farmyards'];
const items = ['All Selected Crops','Rice', 'Cattle and Buffaloes', 'Soya beans', 'Cocoa beans', 'Coffee, green', 'Oil palm fruit', 'Green corn/Maize'];
const endangered = ['Total Endangered','Extant (resident)','Possibly Extinct','Presence Uncertain','Possibly Extant (resident)','Extant & Vagrant (resident)','Possibly Extinct & Vagrant','Extinct']

// Map select arrays and dict to javascript file
const maps = ['Land Use','Crop & Livestock','Deforestation','Biodiversity'];
const abvs = {'Land Use':'rl','Crop & Livestock':'qcl','Deforestation':'fra','Biodiversity':'iucn'};
var abv = 'rl';

// Set default colors
let colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"];
let bin = [];

// Initialize year slider and display
const yearSlider = document.getElementById('yearSlider');
const yearDisplay = document.getElementById('yearDisplay');
yearDisplay.innerHTML = yearSlider.value;

// Initialize dropdown menus
const mapSelect = document.getElementById('mapSelect');
const itemSelect = document.getElementById('itemSelect');
maps.forEach(type => {
  let option = document.createElement('option');
  option.value = type;
  option.innerHTML = type;
  mapSelect.appendChild(option);
});

// Create the map
let map = L.map('map').setView([20, 0], 2);

// Add a tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  minZoom: 2,
  maxZoom: 16
}).addTo(map);

// Create the legend and place it in the bottom-right corner
let legend = L.control({ position: 'bottomright' });

function loadMap() {
    loadJS(`${abvs[mapSelect.value]}`);
    abv = abvs[mapSelect.value];
}

function loadJS(abv, async = false) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", `static/js/${abv}.js`);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  scriptEle.id=abv;

  document.body.appendChild(scriptEle);

  // success event 
  scriptEle.addEventListener("load", () => {
    console.log("File loaded")
  });
    // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

function removeJS(abv) {
  let scriptElem = document.getElementById(abv);
  scriptElem.remove() 
}

function reloadMap(){
  removeJS(abv);
  itemSelect.removeEventListener('change', updateMap)
  yearSlider.removeEventListener('input', updateMap)
  let arrLeg = document.getElementsByClassName('leaflet-bottom')
  arrLeg[0].innerHTML='';
  arrLeg[1].innerHTML='';
  itemSelect.innerHTML = '';
  loadMap();
}

function getColor(value) {
  return value > bin[7] ? colors[7] :
         value > bin[6] ? colors[6] :
         value > bin[5] ? colors[5] :
         value > bin[4] ? colors[4] :
         value > bin[3] ? colors[3] :
         value > bin[2] ? colors[2] :
         value > bin[1] ? colors[1] :
         value > bin[0] ? colors[0] : '#FFF';
}

function round(value, precision=0) {
  var multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

// initialize
loadMap()

// Event listeners for dropdown
mapSelect.addEventListener('change', reloadMap);