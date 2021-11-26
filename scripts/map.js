mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/charlottedrb/ckwf3ekml0w8014phyylgtyd3',
    center: [4.856633, 45.759017],
    zoom: 7
});
let activeDeptId = null;

map.on('load', async () => {
    const csvData = await fetch('/data/air_data_aurat_2016_2018.csv').then((response) => response.text());
    let pollutionByDept = {}, populationByDept = {}, lineFields, csvLines = csvData.split("\n").slice(1);

    for (const line of csvLines) {
        lineFields = line.split(';');
        pollutionByDept[lineFields[0]] = parseFloat(lineFields[1]);
        populationByDept[lineFields[0]] = parseInt(lineFields[6]);
    }
    fetch('/data/france_motorways_lineLine.json').then((response) => response.json()).then((autoroutes) => {
        map.addSource('autoroutes', {
            'type': 'geojson',
            'data': autoroutes
        });

        map.addLayer({
            'id': 'autoroutes',
            'type': 'line',
            'source': 'autoroutes',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
        });
    })

    console.log(map.unproject([-86850.9991750507, 6282953.682973994]))

    fetch('/data/departements.geojson').then((response) => response.json()).then((geojsonData) => {
        for (const f of geojsonData.features) {
            f.properties.pollution = pollutionByDept[f.properties.nom];
            f.properties.population = populationByDept[f.properties.nom];
        }
        map.addSource('departements', {
            'type': 'geojson',
            'data': geojsonData,
            'generateId': true,
        });

        map.addLayer({
            'id': 'departements-fills',
            'type': 'fill',
            'source': 'departements',
            'layout': {},
            'paint': {
                'fill-color': 'purple',
                'fill-opacity': [
                    'interpolate',
                    ['linear'],
                    ['get', 'pollution'],
                    7,
                    0.2,
                    9,
                    0.4,
                    11,
                    0.6,
                    13,
                    0.8,
                ]
            }
        });

        map.addLayer({
            'id': 'departements-borders',
            'type': 'line',
            'source': 'departements',
            'layout': {},
            'paint': {
                'line-color': 'purple',
                'line-width': 1
            }
        });

        // map.addLayer({
        //     'id': 'departements',
        //     'type': 'circle',
        //     'source': 'departements',
        //     'paint': {
        //         'circle-color': 'purple',
        //         'circle-opacity': 0.6,
        //         'circle-radius': 12
        //     }
        // });

        map.addLayer({
            'id': 'departements-population',
            'type': 'symbol',
            'source': 'departements',
            'layout': {
                'text-field': [
                    'number-format',
                    ['get', 'population'],
                    { 'min-fraction-digits': 0, 'max-fraction-digits': 0 }
                ],
                'text-size': 14,
            },
            'paint': {
                'text-color': 'white',
                'icon-color': 'red'
            }
        });

        // When a click event occurs on a feature in the states layer,
        // open a popup at the location of the click, with description
        // HTML from the click event's properties.
        map.on('click', 'departements-fills', (e) => {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<h3>' + e.features[0].properties.nom + '</h3>' +
                    '<p>Ensemble de la zone (μg/m3) : ' + e.features[0].properties.pollution + '</p>'
                )
                .addTo(map);
        });

        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on('mouseenter', 'departements-fills', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on('mouseleave', 'departements-fills', () => {
            map.getCanvas().style.cursor = '';
        });

        // map.on('mousemove', 'departements-fills', (e) => {
        //     if (e.features.length > 0) {
        //         if (activeDeptId !== null) {
        //             map.setFeatureState(
        //                 { source: 'departements', id: activeDeptId },
        //                 { hover: false }
        //             );
        //         }
        //         activeDeptId = e.features[0].id;
        //         map.setFeatureState(
        //             { source: 'departements', id: activeDeptId },
        //             { hover: true }
        //         );
        //     }
        // });

        // map.on('mouseleave', 'departements-fills', () => {
        //     if (activeDeptId !== null) {
        //         map.setFeatureState(
        //             { source: 'departements', id: activeDeptId },
        //             { hover: false }
        //         );
        //     }
        //     activeDeptId = null;
        // });
    })
});
