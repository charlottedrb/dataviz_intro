mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/charlottedrb/ckwf3ekml0w8014phyylgtyd3', // style URL
    center: [4.856633, 45.759017], // starting position [lng, lat]
    zoom: 7 // starting zoom
});

let usableDatas = []
let opacityDatas = []

d3.dsv(";", "/data/air_data_aurat_2016_2018.csv").then(function (data) {
    data.forEach(element => {
        usableDatas.push(parseFloat(element['Ensemble de la zone (μg/m3)']))
    })

    let maxOpacity = 0.8
    let max = usableDatas.reduce((previousValue, currentValue) => {
        if (previousValue < currentValue) {
            return currentValue
        }
        else {
            return previousValue
        }
    }, 0)

    usableDatas.forEach(element => {
        opacityDatas.push(element * maxOpacity / max)
    })
})

fetch('/data/departements.json').then((response) => {
    console.log(response);
})

map.on('load', () => {
    map.addSource('aura-departments', {
        type: 'geojson',
        data: 'https://france-geojson.gregoiredavid.fr/repo/regions/auvergne-rhone-alpes/departements-auvergne-rhone-alpes.geojson'
    });

    map.addLayer({
        id: 'aura-departments-fill',
        source: 'aura-departments',
        type: 'fill',
        paint: {
            'fill-color': 'purple',
            'fill-opacity': 0.9
        }
    })

    map.addLayer({
        id: 'aura-departments-border',
        source: 'aura-departments',
        type: 'line',
        paint: {
            'line-color': 'purple',
            'line-width': 1
        }
    })

    opacityDatas.forEach(element => {
        map.setPaintProperty(
            'aura-departments-fill',
            'fill-opacity',
            element
        );
    })

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // map.on('mouseenter', 'aura-departments-fill', (e) => {
    //     console.log(e.target)
    //     // Change the cursor style as a UI indicator.
    //     map.getCanvas().style.cursor = 'pointer';

    //     // Copy coordinates array.
    //     const coordinates = e.features[0].geometry.coordinates.slice();
    //     const name = e.features[0].properties.nom;

    //     console.log(coordinates);
    //     // Ensure that if the map is zoomed out such that multiple
    //     // copies of the feature are visible, the popup appears
    //     // over the copy being pointed to.
    //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //         console.log(coordinates[0]);
    //     }

    //     // Populate the popup and set its coordinates
    //     // based on the feature found.
    //     console.log(coordinates);
    //     popup.setLngLat(coordinates).setHTML(name).addTo(map);
    // });

    // map.on('mouseleave', 'aura-departments-fill', () => {
    //     map.getCanvas().style.cursor = '';
    //     popup.remove();
    // });
})