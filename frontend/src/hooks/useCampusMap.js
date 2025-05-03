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
    const isLoggedIn = !!sessionStorage.getItem('user'); // Vérification connexion

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
        'salle101': "data:image/jpeg;base64,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",
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