// Load the GeoJSON data
let geojsonData = 'static/data/geojson/faostat.geojson';  // Replace with actual path to your geojson

// Define the available items for the dropdown
const items = ['Rice', 'Cattle and Buffaloes', 'Soya beans', 'Cocoa beans', 'Coffee, green', 'Oil palm fruit', 'Green corn/Maize'];

// Create the map
let map = L.map('map').setView([20, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Populate the item dropdown
const itemSelect = document.getElementById('itemSelect');
items.forEach(item => {
    let option = document.createElement('option');
    option.value = item;
    option.innerHTML = item;
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
                if (Array.isArray(feature.properties.items)) {
                    return feature.properties.items.some(item => item.years.includes(Number(selectedYear)));
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
                    let item = feature.properties.items.find(i => i.item === itemSelect.value);
                    let index = item ? item.years.indexOf(Number(selectedYear)) : -1;
                    let value = index !== -1 ? item.values[index] : 0;

                    return {
                        fillColor: getColor(value),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function (feature, layer) {
                    // Create popup with country name and all item values for the selected year
                    let countryName = feature.properties.name;
                    let popupContent = `<strong>${countryName}</strong><br>`;
                    items.forEach(itemName => {
                        let item = feature.properties.items.find(i => i.item === itemName);
                        if (item) {
                            let index = item.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? item.values[index] : 'No data';
                            popupContent += `${itemName}: ${value}<br>`;
                        } else {
                            popupContent += `${itemName}: No data<br>`;
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
    return value > 200000 ? '#800026' :
           value > 150000 ? '#BD0026' :
           value > 100000 ? '#E31A1C' :
           value > 50000  ? '#FC4E2A' :
           value > 10000  ? '#FD8D3C' :
                            '#FFEDA0';
}

// Create the legend and place it in the bottom-right corner
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0, 10000, 50000, 100000, 150000, 200000];
    let labels = [];

    div.innerHTML += '<h4>Livestock & Crop Distribution</h4>';
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
