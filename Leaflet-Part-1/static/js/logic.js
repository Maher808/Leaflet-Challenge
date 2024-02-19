// Initialize Leaflet map
var map = L.map('map').setView([37.0902, -120.7129], 6);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data from the USGS URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json()) // Parse response as JSON
  .then(data => {
    // Iterate over each earthquake feature
    data.features.forEach(quake => {
      var magnitude = quake.properties.mag;
      var depth = quake.geometry.coordinates[2];
      var color = depth > 300 ? '#FF5733' :
                  depth > 100  ? '#FFC300' :
                  depth > 50  ? '#DAF7A6' :
                                  '#7FFF00';

      var radius = magnitude * 3;

      // Add circle marker for each earthquake
      L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
          radius: radius,
          color: '#000',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.8
      }).bindPopup("<b>Magnitude:</b> " + magnitude + "<br><b>Depth:</b> " + depth + " km").addTo(map);
    });

    // Add legend for depth
    var depthLegend = L.control({position: 'bottomright'});

    depthLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [0, 50, 100, 300],
            colors = ['#7FFF00', '#DAF7A6', '#FFC300', '#FF5733'];

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }

        return div;
    };

    depthLegend.addTo(map);

    // Add legend for magnitude as heat table
    var magnitudeLegend = L.control({position: 'bottomleft'});

    magnitudeLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = ['<span style="background-color:#ffffb2;">-10 - 10</span>', 
                          '<span style="background-color:#fed976;">10 - 30</span>', 
                          '<span style="background-color:#feb24c;">30 - 50</span>', 
                          '<span style="background-color:#fd8d3c;">50 - 70</span>', 
                          '<span style="background-color:#f03b20;">70 - 90</span>', 
                          '<span style="background-color:#bd0026;">90+</span>'];

        div.innerHTML = magnitudes.join('<br>');
        return div;
    };

    magnitudeLegend.addTo(map);
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });
