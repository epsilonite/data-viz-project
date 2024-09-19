// Load the GeoJSON data
let geojsonData = 'static/data/geojson/faostat.geojson';  // Replace with actual path to your geojson
let colors = ["#ecc893","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ba5938;","#ae4633"]
// Define the available items for the dropdown
const landuse = ['Cropland','Permanent meadows and pastures','Forest land','Other land', 'Farm buildings and Farmyards','Unaccounted'];
const agriculture = ['Cropland','Permanent meadows and pastures','Farm buildings and Farmyards','Unaccounted'];

// Create the map
let map = L.map('map').setView([37, 0], 2);

// Add a tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    minZoom: 2,
    maxZoom: 16
}).addTo(map);

// Populate the item dropdown
const itemSelect = document.getElementById('itemSelect');
landuse.forEach(type => {
    let option = document.createElement('option');
    option.value = type;
    option.innerHTML = type;
    itemSelect.appendChild(option);
});

// Initialize year slider and display
const yearSlider = document.getElementById('yearSlider');
const yearDisplay = document.getElementById('yearDisplay');
yearDisplay.innerHTML = yearSlider.value;

// Function to filter and update the map
function updateMap() {
    let selectedYear = yearSlider.value;
    yearDisplay.innerHTML = selectedYear;

    fetch(geojsonData)
        .then(response => response.json())
        .then(data => {
            // Filter features by selected year
            let filteredData = data.features.filter(feature => {
                // Ensure that the 'items' property exists and is an array
                if (Array.isArray(feature.properties.landuse)) {
                    return feature.properties.landuse.some(type => type.years.includes(Number(selectedYear)));
                }
                return false;  // Skip features without 'items'
            });

            // Remove existing layers
            map.eachLayer(layer => {
                if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer);
                }
            });

            // Add filtered data to the map
            L.geoJson(filteredData, {
                style: feature => {
                    let landarea = feature.properties.landarea;
                    let type = feature.properties.landuse.find(i => i.type === itemSelect.value);
                    let index = type ? type.years.indexOf(Number(selectedYear)) : -1;
                    let value = index !== -1 ? round(100*type.values[index]/landarea) : 0;

                    return {
                        fillColor: getColor(value),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '1',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function (feature, layer) {
                    // Create popup with country name and all item values for the selected year
                    let countryName = feature.properties.name;
                    let popupContent = `<strong>${countryName}</strong><br>`;
                    let landarea = feature.properties.landarea;
                    agriculture.forEach(typeName => {
                        let type = feature.properties.landuse.find(i => i.type === typeName);
                        let valued = 0;
                        if (type) {
                            let index = type.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? type.values[index] : 'No data';
                            valued += value;
                        }
                    });
                    popupContent += `agricultural: ${round(100*valued/landarea)}%<br>`;
                    landuse.forEach(typeName => {
                        let type = feature.properties.landuse.find(i => i.type === typeName);
                        if (type) {
                            let index = type.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? type.values[index] : 'No data';
                            popupContent += `${typeName}: ${round(100*value/landarea)}%<br>`;
                        }
                    });
                    layer.bindPopup(popupContent);

                    // Add a click event listener to zoom to the selected country
                    layer.on('click', function (e) {
                        map.fitBounds(e.target.getBounds());  // Zoom to the bounds of the clicked feature
                    });
                }
            }).addTo(map);
        });
}

// Function to get color based on value
function getColor(value) {
    return value > 70 ? colors[7] :
           value > 60 ? colors[6] :
           value > 50 ? colors[5] :
           value > 40 ? colors[4] :
           value > 30 ? colors[3] :
           value > 20 ? colors[2] :
           value > 10 ? colors[1] : colors[0];
}

// Create the legend and place it in the bottom-right corner
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0,10,20,30,40,50,60,70];
    let labels = [];

    div.innerHTML += '<h4>Landuse Percentages</h4>';
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);

// Event listeners for dropdown and slider
itemSelect.addEventListener('change', updateMap);
yearSlider.addEventListener('input', updateMap);

// Initial map load
updateMap();


function round(value, precision=0) {
    var multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}