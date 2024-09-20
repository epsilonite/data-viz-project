const geojsonData = 'static/data/geojson/merged.geojson';
const landuse = ['Agricultural','Cropland','Permanent meadows and pastures','Farm buildings and Farmyards','Forest land','Other land','Unaccounted'];
const agriculture = ['Cropland','Permanent meadows and pastures','Farm buildings and Farmyards'];
const items = ['All','Rice', 'Cattle and Buffaloes', 'Soya beans', 'Cocoa beans', 'Coffee, green', 'Oil palm fruit', 'Green corn/Maize'];
const endangered = ['Extant (resident)','Possibly Extinct','Presence Uncertain','Possibly Extant (resident)','Extant & Vagrant (resident)','Possibly Extinct & Vagrant','Extinct','Total']

let colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"];
// Initialize year slider and display
const yearSlider = document.getElementById('yearSlider');
const yearDisplay = document.getElementById('yearDisplay');
yearDisplay.innerHTML = yearSlider.value;
const maps = ['Land Use','Crop & Livestock','Deforestation','Biodiversity'];
abvs = {'Land Use':'rl','Crop & Livestock':'qcl','Deforestation':'fra','Biodiversity':'iucn'};
var abv = 'none';
const mapSelect = document.getElementById('mapSelect');
maps.forEach(type => {
    let option = document.createElement('option');
    option.value = type;
    option.innerHTML = type;
    mapSelect.appendChild(option);
});

// Create the map
let map = L.map('map').setView([20, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Create the legend and place it in the bottom-right corner
let legend = L.control({ position: 'bottomright' });

function loadMap() {
    loadJS(`${abvs[mapSelect.value]}`);
    abv = abvs[mapSelect.value];
}

function loadJS(abv, async = true) {
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

  loadMap()


  mapSelect.addEventListener('change', reloadMap);

  function reloadMap(){
    removeJS(abv);
    let arrLeg = document.getElementsByClassName('leaflet-bottom')
    arrLeg[0].innerHTML='';
    arrLeg[1].innerHTML='';
    loadMap();
  }