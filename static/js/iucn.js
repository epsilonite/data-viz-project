// get hotspots
var hotspots;
fetch('static/data/geojson/hotspots.geojson')
    .then(response => response.json())
    .then(data => hotspots = data);

// Populate the item dropdown
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
                    if (itemSelect.value=='Total Endangered'){
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
                    let popupContent = `<b>${countryName}</b><br>`;
                    endangered.forEach(statum => {
                        let dict = feature.properties.endangered.find(i => i.status === statum);
                        if (dict) {
                            popupContent += `${statum}: ${dict.species.length} <br>`;
                            popupContent += `observations: ${dict.locations.split(',').length} <br>`;
                        }
                        if (statum=='Total Endangered') {
                            var length = 0;
                            feature.properties.endangered.forEach(d => length += d.species.length);
                            popupContent += `Total Endangered: ${length}<br>`;
                        }
                    });
                    layer.bindPopup(popupContent);
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
            }).addTo(map);
        });
}

colors = ["#fdc926","#fb9e3b","#ed7953","#d8576c","#bd3785","#9c179e","#7301a8","#47039f"];
bin = [0.1,1,2,4,8,16,32,64];

// Create the legend and place it in the bottom-right corner
legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Number of Species</h4>';
    for (let i = 0; i < bin.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(bin[i] + 0.2) + '"></i> ' +
            round(bin[i]) + (bin[i + 1] ? '&ndash;' + bin[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);

// Initial map load
updateMap();

// Add event listeners
itemSelect.addEventListener('change', updateMap);
yearSlider.addEventListener('input', updateMap);
