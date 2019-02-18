Projet Relais & Chateaux

ScrapeMichelin.js récupère les restaurants étoilés sur le site Michelin "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page"
et crée le fichier RestaurantsMichelin.json avec tous les hotels.
ScrapeRelaisChateaux.js récupère les hotels du site Relais Chateaux "https://www.relaischateaux.com/fr/site-map/etablissements"
et crée le fichier ListeRelaisChateaux.json avec tous les hotels.
index.js compare les listes d'hotels et de restaurants étoilés et
 crée un fichier json RelaisEtoiles.json avec tous les relais qui contiennent un restaurant étoilé
RelaisChateaux.html lit le fichier json et l'affiche dans un tableau.
Le fichier affichage.html retranscrit ce fichier json en une table html.
J'ai utilisé la librairie bootstrap pour le .css de la page html.