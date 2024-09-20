// Load the GeoJSON data
colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"]


// Populate the item dropdown
itemSelect = document.getElementById('itemSelect');
itemSelect.innerHTML = '';
landuse.forEach(type => {
    let option = document.createElement('option');
    option.value = type;
    option.innerHTML = type;
    itemSelect.appendChild(option);
});

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
                    let value = 0;
                    if (itemSelect.value == 'Agricultural') {
                        let valued=0
                        agriculture.forEach(typeName => {
                            let type = feature.properties.landuse.find(i => i.type === typeName);
                            if (type) {
                                let index = type.years.indexOf(Number(selectedYear));
                                let n = index !== -1 ? type.values[index] : 'No data';
                                valued += n;
                            }
                        });
                        value = round(100*valued/landarea,1);
                    } else {
                        let type = feature.properties.landuse.find(i => i.type === itemSelect.value);
                        let index = type ? type.years.indexOf(Number(selectedYear)) : -1;
                        value = index !== -1 ? round(100*type.values[index]/landarea,1) : 0;
                    }
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
                    let valued = 0;
                    agriculture.forEach(typeName => {
                        let type = feature.properties.landuse.find(i => i.type === typeName);
                        if (type) {
                            let index = type.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? type.values[index] : 'No data';
                            valued += value;
                        }
                    });
                    popupContent += `<b>Agricultural: ${round(100*valued/landarea,1)}%</b><br>`;
                    landuse.forEach(typeName => {
                        let type = feature.properties.landuse.find(i => i.type === typeName);
                        if (type) {
                            let index = type.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? type.values[index] : 'No data';
                            popupContent += `${typeName}: ${round(100*value/landarea,1)}%<br>`;
                        }
                    });
                    layer.bindPopup(popupContent);
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
           value > 10 ? colors[1] :
           value > 0 ? colors[0] : '#FFF';
}

// Create the legend and place it in the bottom-right corner
legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0.1,10,20,30,40,50,60,70];
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