// Populate the item dropdown
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

colors = ["#ecc893","#e8b575","#e1a360","#d79155","#cb8050","#c26d43","#ba5938","#ae4633"];
bin = [0.1,10,20,30,40,50,60,70]

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Landuse Percentages</h4>';
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