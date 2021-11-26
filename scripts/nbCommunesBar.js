const ctx = document.getElementById('nbCommunesBar').getContext('2d');
const communesData = []
communesData['labels'] = []
communesData['values'] = []


let data = await d3.dsv(";", "/data/air_data_aurat_2016_2018.csv")

data.forEach(element => {
    if(element["Département"] !== "Région") {
        communesData['labels'].push(element["Département"])
        communesData['values'].push(parseInt(element["Nombre de communes > 10μg/m3 (%)"]))
    }
})

const nbCommunes = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: communesData['labels'],
        datasets: [{
            label: 'Nombre de communes > 10μg/m3 (%)',
            data: communesData['values'],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


// Autre moyen de récupérer les données MAIS s'éxecute en dernier à cause du then

// d3.dsv(";", "/data/air_data_aurat_2016_2018.csv").then((data) => {
//     data.forEach(element => {
//         communesData['labels'].push(element["Département"])
//         communesData['values'].push(parseInt(element["Nombre de communes > 10μg/m3 (%)"]))
//     })
    
//     const nbCommunes = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: communesData['labels'],
//             datasets: [{
//                 label: 'Nombres de communes par département',
//                 data: communesData['values'],
                
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// })
