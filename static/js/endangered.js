// Load the GeoJSON data
let geojsonData = 'static/data/geojson/iucn.geojson';  // Replace with actual path to your geojson
let endangered = ['Extant (resident)','Possibly Extinct','Presence Uncertain','Possibly Extant (resident)','Extant & Vagrant (resident)','Possibly Extinct & Vagrant','Extinct','Total']
// Create the map
let map = L.map('map').setView([20, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Populate the item dropdown
const itemSelect = document.getElementById('itemSelect');
endangered.forEach(item => {
    let option = document.createElement('option');
    option.value = item;
    option.innerHTML = item;
    itemSelect.appendChild(option);
});

// Function to filter and update the map
function updateMap() {
    fetch(geojsonData)
        .then(response => response.json())
        .then(data => {
            // Filter features by selected year
            let filteredData = data.features.filter(feature => {
                // Ensure that the 'items' property exists and is an array
                if (Array.isArray(feature.properties.endangered)) {
                    console.log(feature.properties.name)
                    console.log(feature.properties.endangered)
                    return true;
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
                    let dict = feature.properties.endangered.find(i => i.status === itemSelect.value);
                    let length = dict ? dict.species.length : -1;
                    if (itemSelect.value=='Total'){
                        length = 0;
                        feature.properties.endangered.forEach(d => length += d.species.length);
                    }

                    return {
                        fillColor: getColor(length),
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
                    endangered.forEach(statum => {
                        let dict = feature.properties.endangered.find(i => i.status === statum);
                        if (dict) {
                            popupContent += `${statum}: ${dict.species.length} <br>`;
                            popupContent += `observations: ${String(dict.location).length - String(dict.location).replace(/,/g, "").length + 1} <br>`;
                        }
                        if (statum=='Total') {
                            var length = 0;
                            feature.properties.endangered.forEach(d => length += d.species.length);
                            popupContent += `Total: ${length}`;
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
let bins=[0, 1, 3, 8, 22, 62]
// Function to get color based on value
function getColor(value) {
    return value > bins[5] ? '#800026' :
           value > bins[4] ? '#BD0026' :
           value > bins[3] ? '#E31A1C' :
           value > bins[2] ? '#FC4E2A' :
           value > bins[1] ? '#FD8D3C' :
           value > bins[0] ? '#FFEDA0' :
                            '#FFF';
}

// Create the legend and place it in the bottom-right corner
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0, 1, 2, 4, 8, 16];
    let labels = [];

    div.innerHTML += '<h4>Number of Species</h4>';
    for (let i = 0; i < bins.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(bins[i] + 1) + '"></i> ' +
            bins[i] + (bins[i + 1] ? '&ndash;' + bins[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);

// Event listeners for dropdown and slider
itemSelect.addEventListener('change', updateMap);

// Initial map load
updateMap();
