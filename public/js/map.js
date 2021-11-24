mapboxgl.accessToken = 'pk.eyJ1IjoicG91Z2hlIiwiYSI6ImNrd2M5YnJsZzQ2djUzMWx0d2VsYnBseGoifQ.Qe59zNFsnRGc8Gxd58q7pQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.057083, 42.361145],
    zoom: 9

});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


// Fetch stores from API
async function getServices() {
    const res = await fetch('/api/v1/services');
    const data = await res.json();

    const services = data.data.map(service => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    service.location.coordinates[0],
                    service.location.coordinates[1]
                ]
            },
            properties: {
                storeId: service.serviceId,
                icon: 'shop'
            }
        };
    });

    loadMap(services);
}

// Load map with stores
function loadMap(services) {
    map.on('load', function () {
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: services
                }
            },
            layout: {
                'icon-image': '{icon}-15',
                'icon-size': 1.5,
                'text-field': '{serviceId}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });
    });
}

getServices();

