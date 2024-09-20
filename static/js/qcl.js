// Populate the item dropdown
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
                    if (itemSelect.value=='All Selected Crops'){
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
                    let popupContent = `<b>${countryName}</b><br>`;
                    items.forEach(itemName => {
                        let item = feature.properties.items.find(i => i.item === itemName);
                        if (item) {
                            let index = item.years.indexOf(Number(selectedYear));
                            let value = index !== -1 ? item.values[index] : 'No data';
                            let percent = round(value/10/landarea,2);
                            if (percent>50) percent = round(value/100/landarea,2);
                            popupContent += `${itemName}: ${percent}%<br>`;
                        }
                        if (itemName == 'All Selected Crops') {
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

colors = ['#b4de2c','#6dce59','#35b779','#1f9d89','#26838e','#31688e','#3e4b89','#482878'];
bin = [0.1,1,2,4,8,16,32,64];

// Create the legend and place it in the bottom-right corner
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Livestock & Crop Percentage of Land</h4>';
    for (let i = 0; i < bin.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(bin[i] + 1) + '"></i> ' +
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