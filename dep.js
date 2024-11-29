// Correspondance des départements
const departements = {
    "01": "Ain",
    "02": "Aisne",
    "03": "Allier",
    "04": "Alpes-de-Haute-Provence",
    "05": "Hautes-Alpes",
    "06": "Alpes-Maritimes",
    "07": "Ardèche",
    "08": "Ardennes",
    "09": "Ariège",
    "10": "Aube",
    "11": "Aude",
    "12": "Aveyron",
    "13": "Bouches-du-Rhône",
    "14": "Calvados",
    "15": "Cantal",
    "16": "Charente",
    "17": "Charente-Maritime",
    "18": "Cher",
    "19": "Corrèze",
    "21": "Côte-d'Or",
    "22": "Côtes-d'Armor",
    "23": "Creuse",
    "24": "Dordogne",
    "25": "Doubs",
    "26": "Drôme",
    "27": "Eure",
    "28": "Eure-et-Loir",
    "29": "Finistère",
    "30": "Gard",
    "31": "Haute-Garonne",
    "32": "Gers",
    "33": "Gironde",
    "34": "Hérault",
    "35": "Ille-et-Vilaine",
    "36": "Indre",
    "37": "Indre-et-Loire",
    "38": "Isère",
    "39": "Jura",
    "40": "Landes",
    "41": "Loir-et-Cher",
    "42": "Loire",
    "43": "Haute-Loire",
    "44": "Loire-Atlantique",
    "45": "Loiret",
    "46": "Lot",
    "47": "Lot-et-Garonne",
    "48": "Lozère",
    "49": "Maine-et-Loire",
    "50": "Manche",
    "51": "Marne",
    "52": "Haute-Marne",
    "53": "Mayenne",
    "54": "Meurthe-et-Moselle",
    "55": "Meuse",
    "56": "Morbihan",
    "57": "Moselle",
    "58": "Nièvre",
    "59": "Nord",
    "60": "Oise",
    "61": "Orne",
    "62": "Pas-de-Calais",
    "63": "Puy-de-Dôme",
    "64": "Pyrénées-Atlantiques",
    "65": "Hautes-Pyrénées",
    "66": "Pyrénées-Orientales",
    "67": "Bas-Rhin",
    "68": "Haut-Rhin",
    "69": "Rhône",
    "70": "Haute-Saône",
    "71": "Saône-et-Loire",
    "72": "Sarthe",
    "73": "Savoie",
    "74": "Haute-Savoie",
    "75": "Paris",
    "76": "Seine-Maritime",
    "77": "Seine-et-Marne",
    "78": "Yvelines",
    "79": "Deux-Sèvres",
    "80": "Somme",
    "81": "Tarn",
    "82": "Tarn-et-Garonne",
    "83": "Var",
    "84": "Vaucluse",
    "85": "Vendée",
    "86": "Vienne",
    "87": "Haute-Vienne",
    "88": "Vosges",
    "89": "Yonne",
    "90": "Territoire de Belfort",
    "91": "Essonne",
    "92": "Hauts-de-Seine",
    "93": "Seine-Saint-Denis",
    "94": "Val-de-Marne",
    "95": "Val-d'Oise",
    "971": "Guadeloupe",
    "972": "Martinique",
    "973": "Guyane",
    "974": "La Réunion",
    "976": "Mayotte"
  };
  
  // Initialisation de la carte
  const map = L.map('map-dep').setView([46.9, 2], 6);
  
  // Ajouter un fond de carte OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  // Charger et afficher les données
  async function chargerDonnees() {
    try {
      const response = await fetch('data-map.json');
      const donnees = await response.json();
  
    // Filtrer les données de 1958 à 2022
    const donneesFiltrees = donnees.filter(d => d.source.match(/\d+/) >= 1958);

    // Extraire les années disponibles
    const anneesDisponibles = [...new Set(donneesFiltrees.map(d => d.source.match(/\d+/)[0]))].sort();

    // Initialiser le sélecteur d'années
    const yearSelector = document.getElementById('yearSelector');
    anneesDisponibles.forEach(annee => {
      const option = document.createElement('option');
      option.value = annee;
      option.textContent = annee;
      yearSelector.appendChild(option);
    });

    // Afficher la dernière année par défaut
    const derniereAnnee = anneesDisponibles[anneesDisponibles.length - 1]; // Dernière année du tableau trié
    yearSelector.value = derniereAnnee; // Sélectionner la dernière année dans le sélecteur
    afficherCarte(donneesFiltrees, derniereAnnee); // Afficher les données pour la dernière année

      // Afficher les données pour une année donnée
      yearSelector.addEventListener('change', () => afficherCarte(donneesFiltrees, yearSelector.value));
      afficherCarte(donneesFiltrees, anneesDisponibles[anneesDisponibles.length-1]); // Afficher la première année par défaut
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  }
  
  // Calculer les taux d'abstention par département
  function calculerAbstentionParDepartement(donnees, annee) {
    const departementsData = {};
  
    donnees.filter(d => d.source.includes(annee)).forEach(({ dep, inscrits, votants }) => {
      if (!departementsData[dep]) {
        departementsData[dep] = { inscrits: 0, votants: 0 };
      }
      departementsData[dep].inscrits += inscrits;
      departementsData[dep].votants += votants;
    });
  
    // Calculer les taux d'abstention
    const tauxAbstentionParDepartement = {};
    Object.entries(departementsData).forEach(([dep, { inscrits, votants }]) => {
      tauxAbstentionParDepartement[dep] = ((inscrits - votants) / inscrits) * 100;
    });
  
    return tauxAbstentionParDepartement;
  }
  
  // Afficher la carte pour une année donnée
  async function afficherCarte(donnees, annee) {
    const tauxAbstentionParDepartement = calculerAbstentionParDepartement(donnees, annee);
  
    // Charger le GeoJSON des départements français
    const geojsonUrl = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson';
  
    fetch(geojsonUrl)
      .then(response => response.json())
      .then(geojsonData => {
        // Supprimer les couches précédentes
        map.eachLayer(layer => {
          if (layer.options && !layer._url) map.removeLayer(layer);
        });
  
        // Appliquer des styles dynamiques
        function getStyle(feature) {
          const dep = feature.properties.code;
          const taux = tauxAbstentionParDepartement[dep] || 0;
  
          let fillColor;
          if (taux < 20) {
            fillColor = '#4d94ff'; // Bleu clair
          } else if (taux < 30) {
            fillColor = '#85e085'; // Vert clair
          } else if (taux < 40) {
            fillColor = '#ffeb99'; // Jaune
          } else if (taux < 50) {
            fillColor = '#ffa64d'; // Orange
          } else {
            fillColor = '#ff4d4d'; // Rouge
          }
  
          return {
            fillColor,
            fillOpacity: 0.7,
            weight: 1,
            color: '#333' // Contour
          };
        }
  
        // Ajouter des info-bulles
        function onEachFeature(feature, layer) {
          const dep = feature.properties.code;
          const taux = tauxAbstentionParDepartement[dep]?.toFixed(2) || "Non disponible";
          layer.bindPopup(`<strong>${departements[dep]}</strong><br>Taux d'abstention en ${annee} : ${taux}%`);
        }
  
        // Ajouter les départements sur la carte
        L.geoJson(geojsonData, {
          style: getStyle,
          onEachFeature: onEachFeature
        }).addTo(map);
      })
      .catch(error => console.error('Erreur lors du chargement du GeoJSON :', error));
  }
  
  // Lancer le chargement des données
  chargerDonnees();