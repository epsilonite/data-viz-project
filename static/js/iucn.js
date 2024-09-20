var hotspots;
fetch('static/data/geojson/hotspots.geojson')
    .then(response => response.json())
    .then(data => hotspots = data);

// Populate the item dropdown
itemSelect = document.getElementById('itemSelect');
itemSelect.innerHTML = '';
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
                        weight: 1,
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
                            popupContent += `observations: ${dict.locations.split(',').length} <br>`;
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

            L.geoJson(hotspots,{
                style: {
                    color:'black',
                    fillColor:'black',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.2
                },
                onEachFeature: function (feature, layer) {
                    // Create popup with country name and all item values for the selected year
                    let popupContent = `<strong>${feature.properties.NAME}</strong><br>`;
                    layer.bindPopup(popupContent);
                    // Add a click event listener to zoom to the selected country
                    // layer.on('click', function (e) {
                    //     map.fitBounds(e.target.getBounds());  // Zoom to the bounds of the clicked feature
                    // });
                }
            }).addTo(map);
        });
}

// Function to get color based on value
function getColor(value) {
    return value > 62 ? '#800026' :
           value > 22 ? '#BD0026' :
           value > 8 ? '#E31A1C' :
           value > 3 ? '#FC4E2A' :
           value > 1 ? '#FD8D3C' :
           value > 0.1 ? '#FFEDA0' :
                            '#FFF';
}

// Create the legend and place it in the bottom-right corner
legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0, 1, 3, 8, 22, 62];
    let labels = [];

    div.innerHTML += '<h4>Number of Species</h4>';
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0.2) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);

// Event listeners for dropdown and slider
itemSelect.addEventListener('change', updateMap);

// Initial map load
updateMap();
