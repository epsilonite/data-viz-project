colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"]

itemSelect = document.getElementById('itemSelect');
itemSelect.innerHTML = '';
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
                    let popupContent = `<strong>${countryName}</strong><br>`;
                    let landarea = feature.properties.landarea;
                    let index = Number(selectedYear)>2015 ? 3 :
                                Number(selectedYear)>2010 ? 2 :
                                Number(selectedYear)>2000 ? 1 :
                                Number(selectedYear)>1990 ? 0 : -1;
                    let value = Array.isArray(feature.properties.deforestation.values) ? round(100*feature.properties.deforestation.values[index]/landarea,3) : 0;
                    popupContent += `Deforestation: ${value}%<br>`;
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
    return value > .5 ? colors[7] :
           value > .4 ? colors[6] :
           value > .3 ? colors[5] :
           value > .2 ? colors[4] :
           value > .1 ? colors[3] :
           value > .05 ? colors[2] :
           value > .02 ? colors[1] :
           value > .001 ? colors[0] : '#FFF';
}

// Create the legend and place it in the bottom-right corner
legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0,0.02,0.05,0.1,0.2,0.3,0.4,0.5];
    let labels = [];

    div.innerHTML += '<h4>Landuse Percentages</h4>';
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+0.002) + '"></i> ' +
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