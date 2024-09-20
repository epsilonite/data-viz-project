### data-viz-project
# Global Crop Distribution, Deforestation, and Biodiversity Hotspots
Be, Ritu, Caitlin, Rajamani
<br>
<br>
![crop_pic](https://github.com/epsilonite/data-viz-project/blob/main/static/images/read_me.avif)
<br>
## Project Focus
Visualize the overlap between global agricultural crop distribution, deforestation rates, and biodiversity hotspots to understand the impact of agricultural expansion on biodiversity and forest loss.<br>

- **Identify High-Risk Areas:** Pinpoint regions where agricultural expansion is driving both deforestation and biodiversity loss, providing actionable insights for conservation efforts.<br>
- **Understand Crop-Specific Impacts:** Analyze how specific crops are linked to deforestation and biodiversity loss, which can help guide sustainable agricultural practices and policies.<br>
- **Temporal Changes:** Understand how the dynamics of deforestation and biodiversity loss have changed over time and how current trends might continue if no action is taken.

---

## Contents

- [Data Engineering](#Data-Engineering)
- [Data Visualization](#Data-Visualization)
- [Outcomes](#Outcomes)
- [Mitigation](#Mitigation)
- [References](#References)

---

## Data Engineering

Pandas, GeoPandas and sqlLite was used to process CSVs and JSONs
The preprocessing steps taken include: 
- Parsing and extracting Data from json response
- Removing extra headers and worksheets from the source data file
- Creating a hashtable for country names across datasets
- Limiting the date based on availability across various data sources 
- Converting data types
- Merging data from different sources
  
Creating GeoJSON  to use for Javascript visualization<br>
SQL Databases: Individual sqlite databases for separate data sources and a master database

Data Engineering for GeoJSON:
- GeoPandas: .sjoin, .dissolve to bin points into polygons for choropleths
- Pandas: .groupby().agg(list) to preserve data while grouping by country
- Using nested dictionaries to preserve merged data for a given country

![geojson](https://github.com/epsilonite/data-viz-project/blob/main/static/images/geojson_image.png)

Coding Languages and Libraries: Python, HTML, SQL, JavaScript, Folium, Leaflet, GeoPandas, Plotly

---

## Data Visualization

### Topics
  - [Agriculture and Land Usage](#Agriculture-and-Land-Usage)
  - [Tree Loss and Deforestation](#Tree-Loss-and-Deforestation)
  - [Biodiversity Hotspots](#Biodiversity-Hotspots)

---

### Agriculture and Land Usage

- Agricultural land constitutes roughly 30% of the total land area on Earth.
- The largest proportion of this is used for pasture and meadow.
- FAO Definitions:
  - Cropland is land used for cultivation of crops
  - Permanent meadows and pastures are defined as land used permanently (five years or more) to grow herbaceous forage       crops through cultivation or naturally (wild prairie or grazing land). 

![land](https://github.com/epsilonite/data-viz-project/blob/main/static/images/land_use_graph.png)

- Visual of the global distribution of major crops such as rice, soya beans, cocoa beans, coffee, 
palm oil, and maize, and the livestock crop of cattle and buffalo.
- Crops are often grown in regions with high biodiversity, such as tropical rainforests, where deforestation is prevalent.

---

### Tree Loss and Deforestation

- From 2001 to 2023, there was a total of 488 Mha of tree cover loss globally, equivalent to a 12% decrease in tree cover since 2000.
- According to Global Forest Watch, from 2001 to 2023, 22% of tree cover loss was linked to deforestation, which resulted in permanent loss of forests and conversion to non-forest land uses such as agriculture and human settlements.

![tree](https://github.com/epsilonite/data-viz-project/blob/main/static/images/tree_cover_loss_animation_edited.gif)

### Biodiversity Hotspots

## Outcomes
## Mitigation
## References
[FAOSTAT (Food and Agriculture Organization of the United Nations)](https://www.fao.org/faostat/en/#data)<br>
FAO. 2024. FAOSTAT: Food and Agriculture Organization of the United Nations. https://www.fao.org/faostat/en/#data.<br>

[IUCN Red List (International Union for Conservation of Nature)](https://www.iucnredlist.org/)<br>
IUCN. 2024. The IUCN Red List of Threatened Species. Version 2024-1. https://www.iucnredlist.org/.

[GBIF (Global Biodiversity Information Facility)](https://www.gbif.org/)<br>
GBIF.org. 2024. Global Biodiversity Information Facility. https://www.gbif.org/.

[Global Forest Watch, Hansen Global Forest Change](https://www.globalforestwatch.org/)<br>
Hansen, M. C., et al. 2013. High-Resolution Global Maps of 21st-Century Forest Cover Change. Science, 342(6160), 850-853. DOI: 10.1126/science.1244693. Available from: https://www.globalforestwatch.org/.

[ChatGPT 4o](https://chatgpt.com/)<br>
OpenAI. 2024. ChatGPT (GPT-4). OpenAI, San Francisco, CA. https://www.openai.com/.

