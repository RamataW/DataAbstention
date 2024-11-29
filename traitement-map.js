// // Correspondance départements → régions
const departementsRegions = {
  "01": "Auvergne-Rhône-Alpes",
  "02": "Hauts-de-France",
  "03": "Auvergne-Rhône-Alpes",
  "04": "Provence-Alpes-Côte d'Azur",
  "05": "Provence-Alpes-Côte d'Azur",
  "06": "Provence-Alpes-Côte d'Azur",
  "07": "Auvergne-Rhône-Alpes",
  "08": "Grand Est",
  "09": "Occitanie",
  "10": "Grand Est",
  "11": "Occitanie",
  "12": "Occitanie",
  "13": "Provence-Alpes-Côte d'Azur",
  "14": "Normandie",
  "15": "Auvergne-Rhône-Alpes",
  "16": "Nouvelle-Aquitaine",
  "17": "Nouvelle-Aquitaine",
  "18": "Centre-Val de Loire",
  "19": "Nouvelle-Aquitaine",
  "21": "Bourgogne-Franche-Comté",
  "22": "Bretagne",
  "23": "Nouvelle-Aquitaine",
  "24": "Nouvelle-Aquitaine",
  "25": "Bourgogne-Franche-Comté",
  "26": "Auvergne-Rhône-Alpes",
  "27": "Normandie",
  "28": "Centre-Val de Loire",
  "29": "Bretagne",
  "30": "Occitanie",
  "31": "Occitanie",
  "32": "Occitanie",
  "33": "Nouvelle-Aquitaine",
  "34": "Occitanie",
  "35": "Bretagne",
  "36": "Centre-Val de Loire",
  "37": "Centre-Val de Loire",
  "38": "Auvergne-Rhône-Alpes",
  "39": "Bourgogne-Franche-Comté",
  "40": "Nouvelle-Aquitaine",
  "41": "Centre-Val de Loire",
  "42": "Auvergne-Rhône-Alpes",
  "43": "Auvergne-Rhône-Alpes",
  "44": "Pays de la Loire",
  "45": "Centre-Val de Loire",
  "46": "Occitanie",
  "47": "Nouvelle-Aquitaine",
  "48": "Occitanie",
  "49": "Pays de la Loire",
  "50": "Normandie",
  "51": "Grand Est",
  "52": "Grand Est",
  "53": "Pays de la Loire",
  "54": "Grand Est",
  "55": "Grand Est",
  "56": "Bretagne",
  "57": "Grand Est",
  "58": "Bourgogne-Franche-Comté",
  "59": "Hauts-de-France",
  "60": "Hauts-de-France",
  "61": "Normandie",
  "62": "Hauts-de-France",
  "63": "Auvergne-Rhône-Alpes",
  "64": "Nouvelle-Aquitaine",
  "65": "Occitanie",
  "66": "Occitanie",
  "67": "Grand Est",
  "68": "Grand Est",
  "69": "Auvergne-Rhône-Alpes",
  "70": "Bourgogne-Franche-Comté",
  "71": "Bourgogne-Franche-Comté",
  "72": "Pays de la Loire",
  "73": "Auvergne-Rhône-Alpes",
  "74": "Auvergne-Rhône-Alpes",
  "75": "Île-de-France",
  "76": "Normandie",
  "77": "Île-de-France",
  "78": "Île-de-France",
  "79": "Nouvelle-Aquitaine",
  "80": "Hauts-de-France",
  "81": "Occitanie",
  "82": "Occitanie",
  "83": "Provence-Alpes-Côte d'Azur",
  "84": "Provence-Alpes-Côte d'Azur",
  "85": "Pays de la Loire",
  "86": "Nouvelle-Aquitaine",
  "87": "Nouvelle-Aquitaine",
  "88": "Grand Est",
  "89": "Bourgogne-Franche-Comté",
  "90": "Bourgogne-Franche-Comté",
  "91": "Île-de-France",
  "92": "Île-de-France",
  "93": "Île-de-France",
  "94": "Île-de-France",
  "95": "Île-de-France",
  "971": "Guadeloupe",
  "972": "Martinique",
  "973": "Guyane",
  "974": "La Réunion",
  "976": "Mayotte"
};



const map = L.map('map').setView([46.9, 2], 6);

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
    afficherCarte(donneesFiltrees, annees[annees0]); // Afficher la première année par défaut
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
  }
}

// Calculer les taux d'abstention par région
function calculerAbstentionParRegion(donnees, annee) {
  const regions = {};

  donnees.filter(d => d.source.includes(annee)).forEach(({ dep, inscrits, votants }) => {
    const region = departementsRegions[dep];
    if (!regions[region]) {
      regions[region] = { inscrits: 0, votants: 0 };
    }
    regions[region].inscrits += inscrits;
    regions[region].votants += votants;
  });

  // Calculer les taux d'abstention
  const tauxAbstentionParRegion = {};
  Object.entries(regions).forEach(([region, { inscrits, votants }]) => {
    tauxAbstentionParRegion[region] = ((inscrits - votants) / inscrits) * 100;
  });

  return tauxAbstentionParRegion;
}

// Afficher la carte pour une année donnée
async function afficherCarte(donnees, annee) {
  const tauxAbstentionParRegion = calculerAbstentionParRegion(donnees, annee);

  // Charger le GeoJSON des régions françaises
  const geojsonUrl = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson';

  fetch(geojsonUrl)
    .then(response => response.json())
    .then(geojsonData => {
      // Supprimer les couches précédentes
      map.eachLayer(layer => {
        if (layer.options && !layer._url) map.removeLayer(layer);
      });

      // Appliquer des styles dynamiques
      function getStyle(feature) {
        const region = feature.properties.nom;
        const taux = tauxAbstentionParRegion[region] || 0;

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
        const region = feature.properties.nom;
        const taux = tauxAbstentionParRegion[region]?.toFixed(2) || "Non disponible";
        layer.bindPopup(`<strong>${region}</strong><br>Taux d'abstention en ${annee} : ${taux}%`);
      }

      // Ajouter les régions sur la carte
      L.geoJson(geojsonData, {
        style: getStyle,
        onEachFeature: onEachFeature
      }).addTo(map);
    })
    .catch(error => console.error('Erreur lors du chargement du GeoJSON :', error));
}

// Lancer le chargement des données
chargerDonnees();