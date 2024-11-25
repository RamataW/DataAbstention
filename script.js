fetch('data.json')
  .then(response => response.json())
  .then(data => {

    //Extraction des années et des taux d'abstention
    const years = data.donnees.map(item => item.annee); //années
    const values = data.donnees.map(item => item.taux_abstention); //taux d'abstention

    //Configuration du graphique
    const config = {
      type: 'line', //graphique en ligne
      data: {
        labels: years, //Données en abscisses
        datasets: [{
          label: 'Taux d\'abstention (%)', //legende
          data: values,
          fill: true, 
          borderColor: '#3A5BC7', 
          backgroundColor: 'rgb(209, 52, 21, 0.2)',
          borderWidth: 3, 
          pointBackgroundColor: '#fdf1f1',
          pointRadius: 5,
          pointHoverRadius:7, 
          pointHoverBackgroundColor: '#D13415' 
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'end',  
            labels: {
              font: {
                size: 14 
              }
            }
          },
          title: {
            display: true,
            text: data.titre, 
            font: {
              size: 18
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Année',
              font: {
                size: 14
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Taux d\'abstention (%)',
              font: {
                size: 14
              }
            },
            min: 0, 
            ticks: {
              stepSize: 10, 
            }
          }
        }
      }
    };



   
      

    // Création du graphique
    const ctx = document.getElementById('evolution-abstention').getContext('2d');
    new Chart(ctx, config); 
  })