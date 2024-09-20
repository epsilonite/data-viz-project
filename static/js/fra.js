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
                return (feature.properties.deforestation!=null);
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
                    let index = Number(selectedYear)>2015 ? 3 :
                                Number(selectedYear)>2010 ? 2 :
                                Number(selectedYear)>2000 ? 1 :
                                Number(selectedYear)>1990 ? 0 : -1;
                    let value = Array.isArray(feature.properties.deforestation.values) ? round(100*feature.properties.deforestation.values[index]/landarea,3) : 0;
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
                    let popupContent = `<b>${countryName}</b><br>`;
                    let landarea = feature.properties.landarea;
                    let index = Number(selectedYear)>2015 ? 3 :
                                Number(selectedYear)>2010 ? 2 :
                                Number(selectedYear)>2000 ? 1 :
                                Number(selectedYear)>1990 ? 0 : -1;
                    let value = Array.isArray(feature.properties.deforestation.values) ? round(100*feature.properties.deforestation.values[index]/landarea,3) : 0;
                    popupContent += `Deforestation: ${value}%<br>`;
                    layer.bindPopup(popupContent);
                }
            }).addTo(map);
        });
}

colors = ["#fdc926","#fb9e3b","#ed7953","#d8576c","#bd3785","#9c179e","#7301a8","#47039f"];
bin = [0.001,0.02,0.05,0.1,0.2,0.3,0.4,0.5]

// Create the legend and place it in the bottom-right corner
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Landuse Percentages</h4>';
    for (let i = 0; i < bin.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(bin[i]+0.002) + '"></i> ' +
            round(bin[i],2) + (bin[i + 1] ? '&ndash;' + bin[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);

// Initial map load
updateMap();

// Add event listeners
yearSlider.addEventListener('input', updateMap);