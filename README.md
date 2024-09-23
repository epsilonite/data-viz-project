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

### [Presentation Link](https://docs.google.com/presentation/d/1qbUs_a21YbkwIR9OCFMQ2ObmhZDhrxyn/edit#slide=id.p1)

### [Dashborad Link](https://epsilonite.github.io/data-viz-project/)

---

## Contents

- [Data Engineering](#Data-Engineering)
- [Data Visualization](#Data-Visualization)
- [Outcomes](#Outcomes)
- [Mitigation](#Mitigation)
- [Ethical Considerations](#Ethical-Considerations)
- [Dashboard](https://epsilonite.github.io/data-viz-project/)
- [References](#References)

---
<br>

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

![lan](https://github.com/epsilonite/data-viz-project/blob/main/static/images/lan_lib.png)

Processes for cleaning raw data and jupyter notebooks for analysis and visualization are saved in /static/ directory. Cleaned data has been outputted to GeoJSON & csv; along with all Input Data are saved in different folders under /static/data/ directory. Javascripts are in /static/js/ directory, style sheet is in /static/css/ directory. Output images and html files are in /static/images/ directory.

---
<br>

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

- Global distribution of major crops such as rice, soya beans, cocoa beans, coffee, 
palm oil, and maize, and the livestock crop of cattle and buffalo.
- Crops are often grown in regions with high biodiversity, such as tropical rainforests, where deforestation is prevalent.

---

### Tree Loss and Deforestation

- From 2001 to 2023, there was a total of 488 Mha of tree cover loss globally, equivalent to a 12% decrease in tree cover since 2000.
- According to Global Forest Watch, from 2001 to 2023, 22% of tree cover loss was linked to deforestation, which resulted in permanent loss of forests and conversion to non-forest land uses such as agriculture and human settlements.

![tree](https://github.com/epsilonite/data-viz-project/blob/main/static/images/tree_cover_loss_animation_edited.gif)

- The ecological impact of tropical deforestation is significant, primarily causing a drastic loss of species, disruption of ecosystem balance, and potential climate change due to the release of stored carbon dioxide.

![df](https://github.com/epsilonite/data-viz-project/blob/main/static/images/deforest.png)

---

### Biodiversity Hotspots

- A biodiversity hotspot is a region that is both rich in biodiversity (high species diversity and endemism) and under significant threat from human activities such as deforestation, habitat destruction, pollution, and climate change
- 36 biodiversity hotspots globally

![hot](https://github.com/epsilonite/data-viz-project/blob/main/static/images/hotspots.png)

---
<br>

## Outcomes

1. Loss of Biodiversity

![loss](https://github.com/epsilonite/data-viz-project/blob/main/static/images/bio_loss.png)

2. Increased Carbon Emissions

![carb](https://github.com/epsilonite/data-viz-project/blob/main/static/images/carbon_emissions.png)

3. Climate Change / Temperature Change: Land surface temperature change of 1.5 degree C since 1860.

[Temperature Change - Watch Video Here](https://github.com/epsilonite/data-viz-project/blob/main/static/images/temperature_anomaly_animation_with_midline.mp4)

---
<br>

## Mitigation


1. Reforestation and Afforestation Programs.
  - Examples: Brazil's Atlantic Forest Restoration Pact and the Bonn Challenge, a global effort to restore 350 million       hectares of deforested land by 2030. Also Canada’s Billion Trees Initiative.

![forest](https://github.com/epsilonite/data-viz-project/blob/main/static/images/tree_gain.png)

2. Establishment of Protected Areas and Key Biodiversity Areas (KBAs)
  - Examples: The Amazon Region Protected Areas (ARPA) program in Brazil, which aims to protect large portions of the         Amazon Rainforest from deforestation.

![protect](https://github.com/epsilonite/data-viz-project/blob/main/static/images/protect.png)

---
<br>

## Ethical Considerations

1. **Data Accuracy and Transparency**: Data was sourced from accurate, up-to-date, and reliable sources, such as government agencies, scientific studies, and reputable organizations. All data sources are clearly cited to ensure transparency and accountability.
2. **Avoiding Bias**: Efforts were made to avoid any biased narrative. All visualizations are fact-driven, and data was cross-verified using multiple reputable sources to ensure accuracy and objectivity
3. **Balanced Perspective**: A balanced view is portrayed by including important mitigation and conservation efforts, such as reforestation initiatives, the establishment of protected areas. This helps present both the challenges and solutions.
4. **Comprehensive View**: To avoid a "single-story" narrative, global visualizations were created wherever possible, despite the complexity of handling large-scale data. This ensures a broader, more comprehensive understanding of the issues at hand.

---
<br>

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

