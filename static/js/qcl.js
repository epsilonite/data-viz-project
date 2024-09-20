colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"]

// Populate the item dropdown
itemSelect = document.getElementById('itemSelect');
itemSelect.innerHTML = '';
items.forEach(item => {
    let option = document.createElement('option');
    option.value = item;
    option.innerHTML = item;
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
                    let percent = 0;
                    let landarea = feature.properties.landarea;
                    if (itemSelect.value=='All'){
                        let total = 0;
                        feature.properties.items.forEach(item => {
                            let index = item ? item.years.indexOf(Number(selectedYear)) : -1;
                            let value = index !== -1 ? item.values[index] : 0;
                            let pc = round(value/10/landarea,2);
                            if (pc>50) pc = pc/10;
                            percent += pc;
                        });
                    } else {
                        let item = feature.properties.items.find(i => i.item === itemSelect.value);
                        let index = item ? item.years.indexOf(Number(selectedYear)) : -1;
                        let value = index !== -1 ? item.values[index] : 0;
                        percent = round(value/10/landarea,2);
                        if (percent>50) percent = percent/10;
                    }
                    return {
                        fillColor: getColor(percent),
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
                    let landarea = feature.properties.landarea;
                    let popupContent = `<strong>${countryName}</strong><br>`;
                    items.forEach(itemName => {
                        let item = feature.properties.items.find(i => i.item === itemName);
                        if (item) {
                            let index = item.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? item.values[index] : 'No data';
                            let percent = round(value/10/landarea,2);
                            if (percent>50) percent = round(value/100/landarea,2);
                            popupContent += `${itemName}: ${percent}%<br>`;
                        }
                        if (itemName == 'All') {
                            let percent=0;
                            feature.properties.items.forEach(item => {
                                let index = item ? item.years.indexOf(Number(selectedYear)) : -1;
                                let value = index !== -1 ? item.values[index] : 0;
                                let pc = round(value/10/landarea,2);
                                if (pc>50) pc = pc/10;
                                percent += pc;
                            });
                            popupContent += `${itemName}: ${round(percent,2)}%<br>`;
                        }
                    });
                    layer.bindPopup(popupContent);
                }
            }).addTo(map);
        });
}

// Function to get color based on value
function getColor(value) {
    return value > 64 ? colors[7] :
           value > 32 ? colors[6] :
           value > 16 ? colors[5] :
           value > 8 ? colors[4] :
           value > 4 ? colors[3] :
           value > 2 ? colors[2] :
           value > 1 ? colors[1] :
           value > 0.001 ? colors[0] : '#FFF';
}

// Create the legend and place it in the bottom-right corner
legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let grades = [0,1, 2, 4, 8, 16, 32,64];
    let labels = [];

    div.innerHTML += '<h4>Livestock & Crop Percentage of Land</h4>';
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