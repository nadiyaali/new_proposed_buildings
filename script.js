mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaXlhYWxpIiwiYSI6ImNsaHBubXFoODA0a28zZHFtaHNyMTllemIifQ.xzn1MhKrnHfp3D7xqH0w8Q';

var bounds = [
  [144.838858, -37.870314],
  [145.094719, -37.766712]
]; //set bounds
var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/nadiyaali/clw5rju,8x000d01pogy0k3cly'
  style: 'mapbox://styles/nadiyaali/clxr4j4zs00ls01pu0b5beytn',
  center: [144.96, -37.81],
  zoom: 15,
  pitch: 45,
  bearing: -17.6,
  maxBounds: bounds
});

map.on('load', function() {
  /*map.addSource('water-source', {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v8'
    });
    */

  
  map.addSource('dev-buildings-source', {
    type: 'vector',
    url: 'mapbox://nadiyaali.5k0zulu2'
  });


  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;
  var labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field']
  ).id;

  var statusNames = ['APPLIED', 'APPROVED', 'UNDER CONSTRUCTION', 'COMPLETED'];
  var statusColors = ['#fbb4b9', '#f768a1', '#ae017e','#7a0177'];

  for (var i = 0; i < statusNames.length; i++) {
    var statusName = statusNames[i];
    var statusColor = statusColors[i];

    //Add button
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = statusName;
    // Add background color to button
    link.style.backgroundColor = statusColor;
/*
    map.addLayer({
      'id': statusName,
      'type': 'fill',
      'source': 'dev-buildings-source',
      'source-layer': 'development-activity-model-fo-0mihg5',
      'paint': {

        "fill-color": statusColor,
        "fill-outline-color": statusColor
      }
    });
	*/
  map.addLayer({
            'id': statusName,
            'type': 'fill-extrusion',
            'source': 'dev-buildings-source',
      			'source-layer': 'development-activity-model-fo-0mihg5',
             'minzoom': 15,
              'layout': {
                        // Make the layer visible by default.
                        'visibility': 'visible'
                    },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': statusColor,

                // Get `fill-extrusion-height` from the source `height` property.
                'fill-extrusion-height': ['get', 'bldhgt_ahd'],

                // Get `fill-extrusion-base` from the source `base_height` property.
               // 'fill-extrusion-base':10,

                // Make extrusions slightly opaque to see through indoor walls.
                'fill-extrusion-opacity': 0.8
            }
        },
            labelLayerId
            );
          map.setFilter(statusName, ['==', 'status', statusName]);


   // Add popup box on each layer
                map.on('click', statusName, function (e) {
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        // Popup for Buildings
                        .setHTML("<h3>Building status: "+e.features[0].properties.status+ "</h3><b>Dev Key:</b> " + e.features[0].properties.dev_key+ "</br><b>Permit No:</b> " + e.features[0].properties.permit_num  + "</br><b>Number of floors:</b> " + e.features[0].properties.num_floors+ "</br><b>Landuse type:</b> " + e.features[0].properties.land_use_1+"</br><b>Landuse type 2:</b> " + e.features[0].properties.land_use_2 +"</br><b>Landuse type 3:</b> " + e.features[0].properties.land_use_3+"</br><b>Shape_type:</b> " + e.features[0].properties.shape_type+"</br><b>Address:</b> " + e.features[0].properties.address )
                        .addTo(map);
                });
                // Change the icon to a pointer icon when you mouse over a building
                map.on('mouseenter', statusName, function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pan icon when it leaves.
                map.on('mouseleave', statusName, function () {
                    map.getCanvas().style.cursor = '';
                });
 
    link.onclick = function(e) {
      var clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }
    };

    //  Add button
    var layers = document.getElementById('button');
    layers.appendChild(link);

  }

  
});
 
map.addControl(new mapboxgl.NavigationControl());
        // Add a scale control to the map
map.addControl(new mapboxgl.ScaleControl());
