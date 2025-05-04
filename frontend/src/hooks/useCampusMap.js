import { dataObjects, equipments } from '../data/projectData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCampusMap = () => {

    const categories = [
        {
        name: "Salles principales",
        items: ['salle101', 'amphiA', 'refectoire', 'labo_chimie', 'biblio', 'salle_sport']
        },
        {
        name: "Équipements salle101",
        items: ['proj_salle101', 'thermo123', 'light_salle101', 'store_salle101']
        },
        {
        name: "Équipements amphiA",
        items: ['proj_amphiA', 'thermo_amphiA', 'light_amphiA', 'store_amphiA', 'audio_amphiA']
        },
        {
        name: "Équipements refectoire",
        items: ['distributeur_boissons', 'distributeur_snacks', 'cafetiere_auto', 'microwave_ref', 
                'thermo_ref', 'light_ref', 'store_ref', 'air_quality', 'dishwasher']
        },
        {
        name: "Équipements labo_chimie",
        items: ['hotte_labo', 'detecteur_gaz']
        },
        {
        name: "Équipements biblio",
        items: ['scanner_biblio', 'bornes_pret', 'detecteur_rfid']
        },
        {
        name: "Équipements salle_sport",
        items: ['ventilation_gym', 'score_board', 'sono_gym']
        },
        {
        name: "Objets école",
        items: ['grille_ecole', 'light001', 'door001', 'panneau_info', 'alarme_incendie', 
                'eclairage_urgence', 'detecteur_fumee', 'cam_urgence']
        },
        {
        name: "Objets parking & extérieur",
        items: ['acces_parking', 'cam456', 'cam_entree', 'capteur789', 'eclairage_parking', 
                'borne_recharge', 'panneau_places', 'detecteur_parking']
        }
    ];

    // États
    const [selectedType, setSelectedType] = useState("Salles principales");
    const [viewMode, setViewMode] = useState("map");
    const [flippedCard, setFlippedCard] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [floor, setFloor] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('pseudo'); // Vérification connexion

    const handleCardDoubleClick = (obj) => {
        if (!isLoggedIn) {
            document.getElementById('open-login-btn')?.click();
            return;
        }

        let targetCategory = null;
        let targetRoom = null;
        let targetEquipment = null;

        if (obj.type === 'Salle') {
            targetRoom = obj.id;
            targetCategory = 'salles';
        } else {
        targetEquipment = obj.id;
        for (const [roomId, roomEquips] of Object.entries(equipments)) {
            if (roomEquips.some(e => e.id === obj.id)) {
            targetRoom = roomId;
            break;
            }
        }
        
        // Mapping des noms de catégories
        const categoryMapping = {
            "Objets école": "ecole",
            "Objets parking & extérieur": "parking",
            // Ajoutez d'autres mappings si nécessaire
        };

        for (const category of categories) {
            if (category.items.includes(obj.id)) {
            // Utilisez le mapping pour convertir le nom de catégorie
            targetCategory = categoryMapping[category.name] || category.name.toLowerCase();
            break;
            }
        }
        }

        navigate('/dashboard', {
        state: {
            category: targetCategory,
            room: targetRoom,
            equipment: targetEquipment
        }
        });

    };

    const handleCardClick = (obj) => {
        // Gestion du retournement des cartes
        setFlippedCard(flippedCard === obj.id ? null : obj.id);
    };

    const handleMapMouseDown = (e) => {
        if (e.button === 0) { // Clic gauche uniquement
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
        }
    };

    const handleMapMouseMove = (e) => {
        if (isDragging) {
        const dx = (e.clientX - dragStart.x) / scale;
        const dy = (e.clientY - dragStart.y) / scale;
        setPosition({
            x: position.x + dx,
            y: position.y + dy
        });
        setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMapMouseUp = () => {
        setIsDragging(false);
    };

    const getObjectImage = (object) => {
        const imageUrls = {
        // Salles principales
        'salle101': "https://sciences.edu.umontpellier.fr/files/2023/10/salles-informatiques.jpg",
        'amphiA': "https://pbs.twimg.com/media/F7hCZ5xXMAAmnY5?format=jpg&name=large",
        'refectoire': "https://chroniques-architecture.com/wp-content/uploads/2022/02/05-Cergy-Graal-@Clement-Guillaume.jpg",
        'labo_chimie': "https://www.ebi-edu.com/wp-content/uploads/2021/07/Labo_TP-scaled.jpg",
        'biblio': "https://static.affluences.media/sites-pictures/sites/6OCYxxm_P.jpeg",
        'salle_sport': "https://csnb.kalisport.com/public/511/upload/images/gymnase-de-la-varenne/14492355-1705177673136759-7284044157099646948-n.jpg",

        // Équipements salle101
        'proj_salle101': "https://aeevicatko.cloudimg.io/cdn/n/n/https://www.levenly.com/medias/blog/360_360/88/blog-videoprojecteur-professionnel.jpg",
        'thermo123': "https://www.cdiscount.com/pdt2/7/1/8/1/700x700/ywe9792500020718/rw/green-thermostat-numerique-pour-chauffage-au-sol.jpg",
        'light_salle101': "https://partner.gira.com/abbildungen/gira_sensotec_LED_900px_8044_1424190311.jpg",
        'store_salle101': "https://www.eole-france.fr/wp-content/uploads/2020/03/store-coffre-interieur-store-protection-solaire-et-occultation-totale-e1589469509254-560x421.jpg",

        // Équipements amphiA 'proj_amphiA': 'thermo_amphiA': 'light_amphiA':
        'proj_amphiA': "https://aeevicatko.cloudimg.io/cdn/n/n/https://www.levenly.com/medias/blog/360_360/88/blog-videoprojecteur-professionnel.jpg",
        'thermo_amphiA': "https://www.cdiscount.com/pdt2/7/1/8/1/700x700/ywe9792500020718/rw/green-thermostat-numerique-pour-chauffage-au-sol.jpg",
        'light_salle101': "https://partner.gira.com/abbildungen/gira_sensotec_LED_900px_8044_1424190311.jpg",
        'light_amphiA': "https://partner.gira.com/abbildungen/gira_sensotec_LED_900px_8044_1424190311.jpg",
        'store_amphiA': "https://www.eole-france.fr/wp-content/uploads/2020/03/store-coffre-interieur-store-protection-solaire-et-occultation-totale-e1589469509254-560x421.jpg",
        'audio_amphiA': "https://static.wixstatic.com/media/0c25ad_bb89c71bc3fa42b395034df423a46ef6~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85/0c25ad_bb89c71bc3fa42b395034df423a46ef6~mv2.jpg",

        // Équipements refectoire
        'distributeur_boissons': "https://www.cafecompany.fr/media/robimat_99_front.png",
        'distributeur_snacks': "https://www.rpsolutions.fr/549/distributeur-g-snack-smx-outdoor.jpg",
        'cafetiere_auto': "https://www.lidl.fr/assets/gcpcbc4bda3ecfd4879a7e659ab35bbf53d.jpeg",
        'microwave_ref': "https://www.schneiderconsumer.com/app/uploads/2021/06/MICROWAVE_FJORD_SCMWN25GDG_FACE-scaled.jpg",
        'thermo_ref': "https://www.cdiscount.com/pdt2/7/1/8/1/700x700/ywe9792500020718/rw/green-thermostat-numerique-pour-chauffage-au-sol.jpg",
        'light_ref': "https://partner.gira.com/abbildungen/gira_sensotec_LED_900px_8044_1424190311.jpg",
        'store_ref': "https://www.eole-france.fr/wp-content/uploads/2020/03/store-coffre-interieur-store-protection-solaire-et-occultation-totale-e1589469509254-560x421.jpg",
        'air_quality': "https://www.airinspace.com/wp-content/uploads/2022/09/CO2-vert.png",
        'dishwasher': "https://www.fourniresto.com/66376-large_default/lave-vaisselle-professionnel-topline-frontal-a-double-paroi-et-panier-50-x-50.jpg",

        // Équipements labo_chimie
        'hotte_labo': "https://www.biolab.fr/images/stories/virtuemart/product/resized/hotte-labopur-610_560x560.jpg",
        'detecteur_gaz': "https://led-atomant.com/10796-large_default/detecteur-de-gaz-wi-fi-alarme-a-charge-usb-fuites-de-gaz-smart-life-app-control.jpg",

        // Équipements biblio
        'scanner_biblio': "https://www.scansnapit.com/_assets/images/productspage/sv600/sv600-standing-1.jpg",
        'bornes_pret': "https://www.shopbrodart.com/_resources/_global/media/resized/00270/ihwx.e385cba1-4f4a-4c69-a43c-0374765fefe9.500.500.jpg",
        'detecteur_rfid': "https://image.made-in-china.com/202f0j00MgskzbUEghoc/RFID-UHF-Channel-Door-Anti-Theft-Alarm-Reader-Passive-Radio-Frequency-Security-Access.webp",

        // Équipements salle_sport
        'ventilation_gym': "https://brainbox.be/sites/default/files/cocon/Ventilation_et_sanitaire/ventilation-sanitaire-guide-1.jpg",
        'score_board': "https://www.sporenco.com/11903-superlarge_default/tableau-de-score-multisport-eco.jpg",
        'sono_gym': "https://silam.fr/wp-content/uploads/2024/04/equipement-sonorisation-rouen-technique-groupe-silam-pintxos.webp",

        // Objets école
        'grille_ecole': "https://images.prismic.io/lebonartisan/770323adb3911d248588476b14e1c36ce23f8906_un-portail-automatique.jpg?auto=compress,format",
        'light001': "https://partner.gira.com/abbildungen/gira_sensotec_LED_900px_8044_1424190311.jpg",
        'door001': "https://cytech.cyu.fr/medias/photo/img-2894_1612869521306-JPG?ID_FICHE=7744",
        'panneau_info': "https://airpress.fr/media/catalog/product/cache/1e26cd1d4e17108ce3eb8ff7d35aa0f0/0/3/033-050_render_2024-jan-30_09-58-17am-000_customizedview14743408400.png",
        'alarme_incendie': "https://www.alertis.fr/wp-content/uploads/2023/09/r4227-34-du-code-du-travail-alarme-sonore-d-evacuation-incendie.jpg",
        'eclairage_urgence': "https://blog.latrivenetacavi.com/wp-content/uploads/2019/08/illuminazione-di-emergenza.jpg",
        'detecteur_fumee': "https://www.renovationettravaux.fr/wp-content/uploads/2023/09/fumee-incendie.jpg",
        'cam_urgence': "https://thumbs.dreamstime.com/b/sortie-de-secours-et-cam%C3%A9ra-de-s%C3%A9curit%C3%A9-70619297.jpg",

        // Objets parking & extérieur
        'acces_parking': "https://www.rouleraoule.fr/images/cms/1591039790barriere%20parking.png",
        'cam456': "https://sirixmonitoring.com/wp-content/uploads/2024/08/Do-parking-garages-have-cameras-all-you-need-to-know-605x605.webp",
        'cam_entree': "https://www.fcpe75.org/wp-content/uploads/2022/02/video-surveillance.png",
        'capteur789': "https://blog.mistermenuiserie.com/wp-content/uploads/2022/09/detecteur-de-mouvement.jpg",
        'eclairage_parking': "https://b3393928.smushcdn.com/3393928/wp-content/uploads/2023/02/00060663-1024x680.jpg?lossy=1&strip=1&webp=1",
        'borne_recharge': "https://www.carplug.com/4666-thickbox_default/alfen-borne-de-recharge-wallbox-eve-single-sline-type2s-7kw-1ph-32a-acces-rfid-en-option.jpg",
        'panneau_places': "https://www.accor-solutions.com/wp-content/uploads/signaletique-parking-caisson2.jpg",
        'detecteur_parking': "https://cdn.futura-sciences.com/buildsv6/images/mediumoriginal/f/3/8/f384aca8b9_78779_bosckparkingsensor-copier.jpg",
        };

        return imageUrls[object.id] || "data:image/jpeg;base64,..."; // Image par défaut
    };

    // Définition des bâtiments pour le positionnement
    const buildings = {
        "École":        { cx: 175, cy: 180, w: 150, h: 120, r: 90 },
        "Gymnase":      { cx: 500, cy: 180, w: 200, h: 120, r: 110 },
        "Réfectoire":   { cx: 175, cy: 360, w: 150, h: 120, r: 90 },
        "Laboratoire":  { cx: 500, cy: 360, w: 200, h: 120, r: 110 },
        "Bibliothèque": { cx: 825, cy: 180, w: 150, h: 120, r: 90 },
        "Salle info":   { cx: 825, cy: 360, w: 150, h: 120, r: 90 },
        "Amphithéâtre": { cx: 500, cy: 610, w: 200, h: 120, r: 110 },
        "Parking":      { cx: 850, cy: 610, w: 200, h: 120, r: 110 }
    };

    // Fonction améliorée pour le placement des objets en fonction de leur catégorie
    const getObjectPosition = (object, category, index, total) => {
        // Déterminer le bâtiment approprié pour cet objet selon sa catégorie
        let buildingKey = "";
        let isInterior = true;
        
        // Associer chaque catégorie à son bâtiment
        if (category.name === "Salles principales") {
        // Les salles sont placées directement à leur emplacement désigné
        if (object.id === 'school1') return { x: 500, y: 500, interior: true };
        if (object.id === 'gym1') return { x: 535, y: 135, interior: false };
        if (object.id === 'library1') return { x: 903, y: 135, interior: false };
        if (object.id === 'lab1') return { x: 535, y: 338, interior: false };
        if (object.id === 'refectory1') return { x: 175, y: 338, interior: false };
        if (object.id === 'computer1') return { x: 903, y: 338, interior: false };
        if (object.id === 'amphi1') return { x: 535, y: 620, interior: false };
        if (object.id === 'parking1') return { x: 903, y: 620, interior: false };
        
        // Position par défaut si l'ID n'est pas reconnu
        return { x: 100 + (index * 200) % 800, y: 120 + Math.floor(index / 4) * 180, interior: false };
        }

        
        
        // Pour les autres catégories, assigner le bâtiment correspondant
        else if (category.name === "Objets école") {
        buildingKey = "École";
        }
        else if (category.name === "Équipements salle_sport") {
        buildingKey = "Gymnase";
        }
        else if (category.name === "Équipements biblio") {
        buildingKey = "Bibliothèque";
        }
        else if (category.name === "Équipements labo_chimie") {
        buildingKey = "Laboratoire";
        }
        else if (category.name === "Équipements refectoire") {
        buildingKey = "Réfectoire";
        }
        else if (category.name === "Équipements amphiA") {
        buildingKey = "Amphithéâtre";
        }
        else if(category.name === "Équipements salle101") {
        buildingKey = "Salle info";
        }
        else if (category.name === "Objets parking & extérieur") {
        buildingKey = "Parking";
        isInterior = false;
        
        const { cx, cy, w, h } = buildings[buildingKey];
        
        // Positions spécifiques pour chaque type d'objet
        if (object.id === 'acces_parking') {
            return { x: cx - w/2 + 20, y: cy - h/2 + 20, interior: false };
        }
        else if (object.id === 'panneau_places') {
            return { x: cx + w/2 - 20, y: cy - h/2 + 20, interior: false };
        }
        else if (object.id === 'borne_recharge') {
            return { x: cx - w/2 + 20, y: cy + h/2 - 20, interior: false };
        }
        else if (object.id === 'detecteur_parking') {
            return { x: cx + w/2 - 20, y: cy + h/2 - 20, interior: false };
        }
        else if (object.id.includes('cam')) {
            // Caméras aux entrées et points stratégiques
            const camPositions = [
                {x: cx - w/2, y: cy - h/2}, // Coin supérieur gauche
                {x: cx + w/2, y: cy - h/2}, // Coin supérieur droit
                {x: cx - w/2, y: cy + h/2}, // Coin inférieur gauche
                {x: cx + w/2, y: cy + h/2}  // Coin inférieur droit
            ];
            const pos = camPositions[index % camPositions.length];
            return { x: pos.x, y: pos.y, interior: false };
        }
        else if (object.id.includes('eclairage')) {
            // Éclairages autour du parking
            const lightPositions = [
                {x: cx - w/2, y: cy}, // Gauche
                {x: cx + w/2, y: cy}, // Droite
                {x: cx, y: cy - h/2}, // Haut
                {x: cx, y: cy + h/2}  // Bas
            ];
            const pos = lightPositions[index % lightPositions.length];
            return { x: pos.x, y: pos.y, interior: false };
        }
        else if (object.id === 'capteur789') {
            // Capteurs répartis dans le parking
            const sensorPositions = [
                {x: cx - w/4, y: cy - h/4},
                {x: cx + w/4, y: cy - h/4},
                {x: cx - w/4, y: cy + h/4},
                {x: cx + w/4, y: cy + h/4}
            ];
            const pos = sensorPositions[index % sensorPositions.length];
            return { x: pos.x, y: pos.y, interior: false };
        }
        }
        else {
        // Pour les autres catégories non explicitement gérées
        buildingKey = "École"; // par défaut
        }
        
        // Si on n'a pas de placement spécifique et qu'on connaît le bâtiment
        if (buildings[buildingKey]) {
        const { cx, cy, w, h } = buildings[buildingKey];
        
        // Pour les objets intérieurs
        if (isInterior) {
            // Division intelligente de l'espace intérieur
            const rows = Math.ceil(Math.sqrt(total));
            const cols = Math.ceil(total / rows);
            
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            // Placement en grille dans le bâtiment
            const cellWidth = w * 0.8 / cols;
            const cellHeight = h * 0.8 / rows;
            
            const x = cx - (w * 0.4) + col * cellWidth + cellWidth/2;
            const y = cy - (h * 0.4) + row * cellHeight + cellHeight/2;
            
            // Variation légère pour éviter l'effet grille trop rigide
            const offsetX = (Math.random() - 0.5) * cellWidth * 0.4;
            const offsetY = (Math.random() - 0.5) * cellHeight * 0.4;
            
            return { x: x + offsetX, y: y + offsetY, interior: true };
        } 
        // Pour les objets extérieurs
        else {
            // Placement en arc autour du bâtiment
            const startAngle = 0;
            const endAngle = Math.PI * 1.5;
            
            const angle = startAngle + (endAngle - startAngle) * (index / (total - 1 || 1));
            const distance = Math.max(w, h) * 0.7;
            
            const x = cx + distance * Math.cos(angle);
            const y = cy + distance * Math.sin(angle);
            
            return { x, y, interior: false };
        }
        }
        
        // Position de secours si aucun bâtiment n'est trouvé
        return { 
        x: 100 + (index * 200) % 800, 
        y: 120 + Math.floor(index / 4) * 180, 
        interior: isInterior 
        };
    };

    // Fonction pour obtenir tous les objets d'un bâtiment spécifique
    const getObjectsByBuilding = (buildingKey) => {
        const allObjects = [
        ...dataObjects,
        ...equipments.lighting,
        ...equipments.cameras,
        ...equipments.sensors,
        ...equipments.alarms,
        ...equipments.computers,
        ...equipments.parking
        ];
        
        // Filtre pour le type sélectionné si nécessaire
        const filteredObjects = selectedType !== "Salles principales" 
        ? allObjects.filter(obj => {
            const categoryMatch = categories.find(cat => cat.name === selectedType);
            return categoryMatch && categoryMatch.items.includes(obj.id);
            })
        : allObjects;
        
        // Filtre pour le bâtiment spécifique
        return filteredObjects.filter(obj => obj.location === buildingKey);
    };

    // Fonction pour obtenir l'icône appropriée
    const getObjectIcon = (object) => {
        // Salles principales
        if (object.id === 'salle101') return '💻';
        if (object.id === 'amphiA') return '🎭';
        if (object.id === 'refectoire') return '🍽️';
        if (object.id === 'labo_chimie') return '🧪';
        if (object.id === 'biblio') return '📚';
        if (object.id === 'salle_sport') return '🏀';

        // Équipements salle101
        if (object.id === 'proj_salle101') return '📽️';
        if (object.id === 'thermo123') return '🌡️';
        if (object.id === 'light_salle101') return '💡';
        if (object.id === 'store_salle101') return '🪟';

        // Équipements amphiA
        if (object.id === 'proj_amphiA') return '📽️';
        if (object.id === 'thermo_amphiA') return '🌡️';
        if (object.id === 'light_amphiA') return '💡';
        if (object.id === 'store_amphiA') return '🪟';
        if (object.id === 'audio_amphiA') return '🔊';

        // Équipements réfectoire
        if (object.id === 'distributeur_boissons') return '🥤';
        if (object.id === 'distributeur_snacks') return '🍫';
        if (object.id === 'cafetiere_auto') return '☕';
        if (object.id === 'microwave_ref') return '🍲';
        if (object.id === 'thermo_ref') return '🌡️';
        if (object.id === 'light_ref') return '💡';
        if (object.id === 'store_ref') return '🪟';
        if (object.id === 'air_quality') return '🌬️';
        if (object.id === 'dishwasher') return '🍽️';

        // Équipements labo_chimie
        if (object.id === 'hotte_labo') return '🧪';
        if (object.id === 'detecteur_gaz') return '⚠️';

        // Équipements bibliothèque
        if (object.id === 'scanner_biblio') return '📄';
        if (object.id === 'bornes_pret') return '📖';
        if (object.id === 'detecteur_rfid') return '📱';

        // Équipements salle_sport
        if (object.id === 'ventilation_gym') return '💨';
        if (object.id === 'score_board') return '🏆';
        if (object.id === 'sono_gym') return '🔊';

        // Objets école
        if (object.id === 'grille_ecole') return '🔒';
        if (object.id === 'light001') return '💡';
        if (object.id === 'door001') return '🚪';
        if (object.id === 'panneau_info') return 'ℹ️';
        if (object.id === 'alarme_incendie') return '🚨';
        if (object.id === 'eclairage_urgence') return '⚡';
        if (object.id === 'detecteur_fumee') return '🔥';
        if (object.id === 'cam_urgence') return '📹';

        // Objets parking & extérieur
        if (object.id === 'acces_parking') return '🚗';
        if (object.id.includes('cam')) return '📹';
        if (object.id === 'capteur789') return '📡';
        if (object.id.includes('eclairage')) return '💡';
        if (object.id === 'borne_recharge') return '🔌';
        if (object.id === 'panneau_places') return '🅿️';
        if (object.id === 'detecteur_parking') return '🚘';

        // Par défaut
        return '❓';
    };


    return {
        categories, buildings,
        selectedType, setSelectedType,
        viewMode, setViewMode,
        flippedCard, setFlippedCard,
        selectedBuilding, setSelectedBuilding,
        floor, setFloor,
        scale, setScale,
        position, setPosition,
        isDragging, setIsDragging,
        dragStart, setDragStart,
        navigate, isLoggedIn,
        handleCardDoubleClick, handleCardClick, handleMapMouseDown, handleMapMouseMove, handleMapMouseUp,
        getObjectImage, getObjectPosition, getObjectsByBuilding, getObjectIcon
    }
}