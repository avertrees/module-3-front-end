
mapboxgl.accessToken = 'pk.eyJ1IjoiYXZlcnRyZWVzIiwiYSI6ImNrMGIzNjd0MDBxOGczanI3YXRnMndmb28ifQ.vMs6tdz00Q9KCQ_OSWtn8w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
    center: [-77.38, 39], // starting position
    zoom: 3 // starting zoom
});


map.on('click', function (e) {
    let cordinates = JSON.stringify(e.lngLat.wrap());
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    let mouse = JSON.stringify(e.point)
    // e.lngLat is the longitude, latitude geographical position of the event
    let coord = JSON.stringify(e.lngLat.wrap());
    let lng = e.lngLat.lng
    let lat = e.lngLat.lat
    let id = Math.random() + 1
    console.log(`long ${lng}, lat ${lat}`)
    createPin(lng, lat, id)
});

function createPin(lng, lat, id) {
    map.addLayer({
        "id": `points-${id}`,
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "title": "Mapbox DC",
                        "icon": "monument"
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    })
}
