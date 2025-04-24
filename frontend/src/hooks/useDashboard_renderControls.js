import React from 'react';
import { 
  ObjectControls,
  ControlButton,
  RangeSlider,
  ValueDisplay,
  ToggleButton
} from '../styles/DashboardStyles';
import { FaBell, FaBarcode, FaExclamationTriangle, FaMinus, FaPlus, FaFillDrip, FaWind, FaFilter, FaGasPump, FaSkullCrossbones, FaTint, FaSeedling, FaUserCheck, FaUserTimes, FaBookMedical, FaBookReader, FaBroom, FaChargingStation, FaCar, FaFire, FaSmog, FaDoorOpen, FaDoorClosed, FaCarAlt } from 'react-icons/fa';

export const renderControls = (obj, isEquipment, handlers) => {
    const { 
        handleObjectControl, 
        handleEquipmentControl, 
        isSchoolClosed, 
        isFireAlarmActive, 
        selectedRoom, 
        objects,
        tempInputValues,
        setTempInputValues 
    } = handlers;

    const alwaysActiveObjects = [
        'detecteur_fumee',
        'alarme_incendie', 
        'cam_urgence',
        'cam456',
        'cam_entree',
        'capteur789',
        'detecteur_parking',
        'acces_parking'
    ];

    if (obj.id !== 'grille_ecole' && isSchoolClosed() && !alwaysActiveObjects.includes(obj.id)) {
        return (
        <ObjectControls>
            <ValueDisplay style={{color: 'red'}}>École fermée - Contrôles désactivés</ValueDisplay>
        </ObjectControls>
        );
    }

    if (isEquipment && selectedRoom) {
        const room = objects.find(r => r.id === selectedRoom);
        if (room.status === 'Occupée') {
        return (
            <ObjectControls>
            <ValueDisplay style={{color: 'red'}}>Salle occupée - Contrôles désactivés</ValueDisplay>
            </ObjectControls>
        );
        }
    }

    if (isFireAlarmActive() && obj.id !== 'alarme_incendie') {
        return (
        <ObjectControls>
            <ValueDisplay style={{color: 'red', fontWeight: 'bold'}}>ALARME INCENDIE - CONTRÔLES BLOQUÉS</ValueDisplay>
        </ObjectControls>
        );
    }

    if (obj.type === 'Salle') {
        return (
        <ObjectControls>
            <ControlButton 
            active={obj.status === 'Disponible'}
            onClick={() => handleObjectControl(obj.id, 'salle', 'Disponible')}>
            Disponible
            </ControlButton>
            <ControlButton 
            active={obj.status === 'Occupée'}
            onClick={() => handleObjectControl(obj.id, 'salle', 'Occupée')}>
            Occuper
            </ControlButton>
        </ObjectControls>
        );
    }

    const handler = isEquipment ? handleEquipmentControl : handleObjectControl;
    
    switch (obj.type) {
        case 'Chauffage':
        return (
            <ObjectControls>
            <ValueDisplay>{obj.status === 'Inactif' ? 'Inactif' : `${obj.targetTemp}°C`}</ValueDisplay>
            <RangeSlider
                type="range"
                min="0"
                max="30"
                step="1"
                value={obj.status === 'Inactif' ? 0 : obj.targetTemp}
                onChange={(e) => handler(obj.id, 'temperature', e.target.value)}
                disabled={obj.status === 'Inactif' || obj.mode?.toLowerCase() === 'auto'}
            />
            <ToggleButton
                active={obj.status === 'Actif'}
                onClick={() => handler(obj.id, 'thermo_toggle', obj.status !== 'Actif')}>
                {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
            <ToggleButton 
                active={obj.mode?.toLowerCase() === 'auto'}
                onClick={() => handler(obj.id, 'mode', obj.mode?.toLowerCase() === 'auto' ? 'manual' : 'auto')}
                disabled={obj.status === 'Inactif'}>
                {obj.mode?.toLowerCase() === 'auto' ? 'Mode Auto' : 'Mode Manuel'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Éclairage':
        return (
            <ObjectControls>
            <RangeSlider
                type="range"
                min="0"
                max="100"
                value={obj.status === 'Éteint' ? 0 : obj.brightness}
                onChange={(e) => handler(obj.id, 'brightness', e.target.value)}
                disabled={obj.status === 'Éteint'}
            />
            <ValueDisplay>{obj.status === 'Éteint' ? '0' : obj.brightness}%</ValueDisplay>
            <ToggleButton 
                active={obj.status === 'Allumé'}
                onClick={() => handler(obj.id, 'light', obj.status !== 'Allumé')}>
                {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Caméra':
        return (
            <ObjectControls>
            <ToggleButton 
                active={obj.status === 'Actif'}
                onClick={() => handler(obj.id, 'camera', obj.status !== 'Actif')}>
                {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Porte':
        return (
            <ObjectControls>
            <ToggleButton 
                active={obj.status === 'Déverrouillée'}
                onClick={() => handler(obj.id, 'door', obj.status !== 'Déverrouillée')}>
                {obj.status === 'Déverrouillée' ? 'Verrouiller' : 'Déverrouiller'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Capteur':
        if (obj.id === 'air_quality') {
            const co2High = obj.co2Level > obj.co2Threshold;
            return (
                <ObjectControls>
                <ValueDisplay style={{ color: co2High ? 'red' : 'inherit' }}>
                    CO2: {obj.co2Level} ppm {co2High && <FaExclamationTriangle title="Niveau élevé" />}
                </ValueDisplay>
                <ValueDisplay>Humidité: {obj.humidity}%</ValueDisplay>
                <ValueDisplay>Dernière mesure: {new Date(obj.lastMeasure).toLocaleTimeString()}</ValueDisplay>
                <ControlButton
                    onClick={() => handler(obj.id, 'ventilate_room')}
                    style={{ marginTop: '10px' }}>
                    <FaWind /> Aérer la pièce
                </ControlButton>
                </ObjectControls>
            );
        }
        return (
            <ObjectControls>
            <ToggleButton 
                active={obj.status === 'Actif'}
                onClick={() => handler(obj.id, 'sensor', obj.status !== 'Actif')}>
                {obj.status === 'Actif' ? 'Désactiver' : 'Activer'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Audio':
        return (
            <ObjectControls>
            <RangeSlider
                type="range"
                min="0"
                max="100"
                value={obj.status === 'Mute' ? 0 : obj.volume}
                onChange={(e) => handler(obj.id, 'volume', e.target.value)}
                disabled={obj.status === 'Mute'}
            />
            <ValueDisplay>{obj.status === 'Mute' ? '0' : obj.volume}%</ValueDisplay>
            <ToggleButton 
                active={obj.status === 'Allumé'}
                onClick={() => handler(obj.id, 'audio', obj.status !== 'Allumé')}>
                {obj.status === 'Allumé' ? 'Mute' : 'Démute'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Distributeur':
        return (
            <ObjectControls>
            <div>
                <h4>Niveaux de Stock:</h4>
                {Object.entries(obj.stock).map(([item, level]) => (
                <div key={item} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '80px' }}>{item}:</span>
                    <progress value={level} max={obj.capacity[item]} style={{ width: '50%', marginRight: '5px' }}></progress>
                    <span style={{ marginRight: '10px' }}>{level}/{obj.capacity[item]}</span>
                    <ControlButton
                    onClick={() => handler(obj.id, 'take_provision', item)}
                    disabled={level === 0 || obj.status === 'Maintenance'}
                    title={`Prendre un(e) ${item}`}
                    style={{ padding: '2px 5px', minWidth: 'auto' }}>
                    <FaMinus />
                    </ControlButton>
                </div>
                ))}
            </div>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'refill_stock')}>
                Réapprovisionner
                </ControlButton>
            <ToggleButton
                active={obj.needsMaintenance}
                onClick={() => handler(obj.id, 'maintenance', !obj.needsMaintenance)}>
                {obj.needsMaintenance ? 'Maintenance Requise' : 'Fonctionnel'}
            </ToggleButton>
            </div>
            </ObjectControls>
        );

        case 'Cafetiere':
        const waterLow = obj.waterLevel < obj.waterLowThreshold;
        const beansLow = obj.beansLevel < obj.beansLowThreshold;
        const isCleaning = obj.isCleaning;
        return (
            <ObjectControls>
            <ValueDisplay>État: {isCleaning ? 'Nettoyage en cours' : obj.status}</ValueDisplay>
            <ValueDisplay>Mode: {obj.mode}</ValueDisplay>
            <div style={{ margin: '5px 0' }}>
                <span style={{ color: waterLow ? 'orange' : 'inherit' }}>
                Eau: {waterLow && <FaExclamationTriangle title="Niveau bas" />}
                </span>
                <progress value={obj.waterLevel} max="100" style={{ width: '60%' }}></progress>
                <span> {obj.waterLevel}% </span>
                <ControlButton
                onClick={() => handler(obj.id, 'fill_water')}
                disabled={obj.waterLevel === 100 || isCleaning}
                title="Remplir Eau">
                <FaTint />
                </ControlButton>
            </div>
            <div style={{ margin: '5px 0' }}>
                <span style={{ color: beansLow ? 'orange' : 'inherit' }}>
                Grains: {beansLow && <FaExclamationTriangle title="Niveau bas" />}
                </span>
                <progress value={obj.beansLevel} max="100" style={{ width: '60%' }}></progress>
                <span> {obj.beansLevel}% </span>
                <ControlButton
                onClick={() => handler(obj.id, 'fill_beans')}
                disabled={obj.beansLevel === 100 || isCleaning}
                title="Remplir Grains">
                <FaSeedling />
                </ControlButton>
            </div>
            <ValueDisplay>Température: {obj.temperature}°C</ValueDisplay>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <ToggleButton
                active={obj.status === 'Actif' || obj.status === 'Prêt'}
                onClick={() => handler(obj.id, 'cafetiere_toggle', obj.status === 'Inactif' || obj.status === 'Veille')}
                disabled={isCleaning || waterLow || beansLow}>
                {obj.status === 'Inactif' || obj.status === 'Veille' ? 'Allumer' : 'Éteindre'}
            </ToggleButton>
                <ControlButton
                onClick={() => handler(obj.id, 'cafetiere_clean', !isCleaning)}
                disabled={obj.status === 'Inactif' || obj.status === 'Veille' || waterLow}
                style={{ backgroundColor: isCleaning ? '#e74c3c' : undefined }}>
                {isCleaning ? <><FaBroom /> Arrêter Nettoyage</> : <><FaBroom /> Nettoyer</>}
                </ControlButton>
            </div>
            {isCleaning && (
                <ValueDisplay style={{ color: 'orange', marginTop: '10px' }}>
                Nettoyage en cours - Autres commandes désactivées
                </ValueDisplay>
            )}
            </ObjectControls>
        );

        case 'Microwave':
        const isCooking = obj.status === 'En cours';
        const isFinished = obj.status === 'Terminé';
        const doorOpen = obj.doorStatus === 'Ouverte';
        
        return (
            <ObjectControls>
            <ValueDisplay style={{ fontWeight: 'bold', color: isFinished ? 'red' : 'inherit' }}>
                État: {obj.status}
            </ValueDisplay>
            <ValueDisplay>Porte: {obj.doorStatus}</ValueDisplay>
            
            {/* Timer avec animation */}
            <div 
                style={{ 
                margin: '15px 0', 
                textAlign: 'center',
                padding: '8px',
                backgroundColor: '#000',
                color: isFinished ? '#ff3b30' : (isCooking ? '#0f0' : '#333'),
                fontFamily: 'monospace',
                fontSize: '2em',
                borderRadius: '4px',
                letterSpacing: '2px',
                boxShadow: isCooking ? '0 0 8px #0f0' : 'none',
                animation: isCooking ? 'pulse 1s infinite' : 'none'
                }}
            >
                {obj.timer} sec
                {isCooking && (
                <span style={{marginLeft: '8px', display: 'inline-block'}}>
                    ▶
                </span>
                )}
            </div>
            
            <div style={{ margin: '10px 0' }}>
                <label>Temps (sec): </label>
                <RangeSlider
                type="range"
                min="0"
                max={obj.maxTime || 180}
                step="1"
                value={obj.timer}
                onChange={(e) => handler(obj.id, 'microwave_timer', e.target.value)}
                disabled={isCooking || doorOpen || isFinished}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ControlButton 
                    onClick={() => handler(obj.id, 'microwave_timer', Math.max(0, obj.timer - 1))}
                    disabled={isCooking || doorOpen || obj.timer <= 0 || isFinished}>
                    <FaMinus />
                </ControlButton>
                <ValueDisplay>{obj.timer}s</ValueDisplay>
                <ControlButton 
                    onClick={() => handler(obj.id, 'microwave_timer', Math.min(obj.maxTime || 180, obj.timer + 1))}
                    disabled={isCooking || doorOpen || obj.timer >= (obj.maxTime || 180) || isFinished}>
                    <FaPlus />
                </ControlButton>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ToggleButton
                active={isCooking}
                onClick={() => handler(obj.id, isFinished ? 'reset_microwave' : 'microwave_start_stop', !isCooking)}
                disabled={(obj.timer === 0 && !isCooking && !isFinished) || doorOpen}
                style={{ 
                    backgroundColor: isFinished ? '#2ecc71' : (isCooking ? '#e74c3c' : (obj.timer > 0 ? '#2ecc71' : undefined)),
                    flex: '1',
                    animation: isFinished ? 'pulse 1s infinite' : 'none'
                }}>
                {isFinished ? 'Réinitialiser' : (isCooking ? 'Arrêter' : 'Démarrer')}
                </ToggleButton>
                <ToggleButton
                active={doorOpen}
                onClick={() => handler(obj.id, 'microwave_door', !doorOpen)}
                disabled={isCooking}
                style={{ flex: '1' }}>
                {doorOpen ? 'Fermer Porte' : 'Ouvrir Porte'}
                </ToggleButton>
            </div>
            
            {isCooking && (
                <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                color: '#e74c3c',
                padding: '5px',
                border: '1px solid #e74c3c',
                borderRadius: '4px'
                }}>
                Cuisson en cours...
                </div>
            )}
            
            {isFinished && (
                <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '10px',
                borderRadius: '4px',
                fontWeight: 'bold'
                }}>
                CUISSON TERMINÉE !
                </div>
            )}
            </ObjectControls>
        );

        case 'AirSensor':
        const co2High = obj.co2Level > obj.co2Threshold;
        return (
            <ObjectControls>
            <ValueDisplay style={{ color: co2High ? 'red' : 'inherit' }}>
                CO2: {obj.co2Level} ppm {co2High && <FaExclamationTriangle title="Niveau élevé" />}
            </ValueDisplay>
            <ValueDisplay>Humidité: {obj.humidity}%</ValueDisplay>
            <ValueDisplay>Dernière mesure: {new Date(obj.lastMeasure).toLocaleTimeString()}</ValueDisplay>
            <ControlButton
                onClick={() => handler(obj.id, 'ventilate_room')}
                style={{ marginTop: '10px' }}>
                <FaWind /> Aérer la pièce
            </ControlButton>
            </ObjectControls>
        );

        case 'Dishwasher':
        const rinseAidLow = obj.rinseAidLevel < obj.rinseAidLowThreshold;
        const rinseAidEmpty = obj.rinseAidLevel <= 0;
        return (
            <ObjectControls>
            <ValueDisplay>État: {obj.status}</ValueDisplay>
            {obj.status === 'En cours' && obj.timeRemaining > 0 && (
                <ValueDisplay>Temps restant: {obj.timeRemaining} min</ValueDisplay>
            )}
            <div style={{ margin: '10px 0' }}>
                <label>Programme: </label>
                <select
                value={obj.program}
                onChange={(e) => handler(obj.id, 'dishwasher_select_program', e.target.value)}
                disabled={obj.status === 'En cours'}>
                {obj.availablePrograms.map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                ))}
                </select>
                {obj.program === 'Intensif' && (
                <small style={{ display: 'block', color: 'orange', marginTop: '3px' }}>
                    Consommation élevée de liquide de rinçage
                </small>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <ValueDisplay style={{ color: rinseAidEmpty ? 'red' : (rinseAidLow ? 'orange' : 'inherit'), marginRight: '10px' }}>
                Liquide Rinçage: {obj.rinseAidLevel}% {rinseAidEmpty ? <FaExclamationTriangle title="Vide" /> : (rinseAidLow && <FaExclamationTriangle title="Niveau bas" />)}
                </ValueDisplay>
                <ControlButton
                onClick={() => handler(obj.id, 'fill_rinse_aid')}
                disabled={obj.rinseAidLevel === obj.rinseAidMaxCapacity}
                title="Remplir liquide de rinçage">
                <FaFillDrip />
                </ControlButton>
            </div>
            <ToggleButton
                active={obj.status === 'En cours'}
                onClick={() => handler(obj.id, 'dishwasher_start_stop', obj.status !== 'En cours')}
                disabled={rinseAidEmpty && obj.status !== 'En cours'}>
                {obj.status === 'En cours' ? 'Arrêter' : 'Démarrer'}
            </ToggleButton>
            {rinseAidEmpty && obj.status !== 'En cours' && (
                <ValueDisplay style={{ color: 'red', marginTop: '10px' }}>
                Impossible de démarrer: Liquide de rinçage vide
                </ValueDisplay>
            )}
            </ObjectControls>
        );

        case 'Ventilation':
        if (obj.id === 'hotte_labo') {
            const filterLow = obj.filterLife < obj.filterChangeThreshold;
            return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
                <div style={{ margin: '10px 0' }}>
                <label>Vitesse: </label>
                <RangeSlider
                type="range"
                min="0"
                    max={obj.maxSpeed}
                value={obj.speed}
                onChange={(e) => handler(obj.id, 'ventilation_speed', e.target.value)}
                    disabled={obj.status === 'Éteint'}
                />
                <ValueDisplay>{obj.speed}%</ValueDisplay>
                </div>
                <ToggleButton
                    active={obj.status === 'Actif'}
                onClick={() => handler(obj.id, 'ventilation_toggle', obj.status !== 'Actif')}>
                {obj.status === 'Actif' ? 'Éteindre' : 'Allumer'}
                </ToggleButton>
                <div style={{ marginTop: '15px' }}>
                <ValueDisplay style={{ color: filterLow ? 'orange' : 'inherit' }}>
                    Filtre: {obj.filterStatus} ({obj.filterLife}%) {filterLow && <FaExclamationTriangle title="Remplacement requis" />}
                </ValueDisplay>
                <ControlButton
                    onClick={() => handler(obj.id, 'replace_filter')}
                    disabled={obj.filterStatus === 'OK' && obj.filterLife === 100}>
                    <FaFilter /> Remplacer Filtre
                </ControlButton>
                <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px' }}>
                Dernière maintenance: {new Date(obj.lastMaintenance).toLocaleDateString()}
                </ValueDisplay>
                </div>
            </ObjectControls>
            );
        }
        if (obj.id === 'ventilation_gym') {
            const isManual = obj.mode === 'Manual';
            const isOff = obj.mode === 'Off' || obj.status === 'Inactif';
            return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
                <ValueDisplay>Mode: {obj.mode}</ValueDisplay>
                <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <label style={{ alignSelf: 'center' }}>Mode:</label>
                {obj.availableModes.map(mode => (
                    <ControlButton
                    key={mode}
                    active={obj.mode === mode}
                    onClick={() => handler(obj.id, 'ventilation_gym_mode', mode)}
                    style={{ flexGrow: 1, textAlign: 'center' }} // Make buttons fill space
                    >
                    {mode}
                    </ControlButton>
                ))}
                </div>
                <div style={{ margin: '10px 0' }}>
                <label>Vitesse:</label>
                <RangeSlider
                type="range"
                min="0"
                    max={obj.maxSpeed}
                    value={isOff ? 0 : obj.speed}
                    onChange={(e) => handler(obj.id, 'ventilation_speed', e.target.value)}
                    disabled={!isManual}
                />
                <ValueDisplay>{isOff ? 0 : obj.speed}%</ValueDisplay>
                </div>
            </ObjectControls>
            );
        }
        return null;

        case 'Scanner':
        if (obj.id === 'scanner_biblio') {
            let resultText = 'Inconnu';
            let resultColor = 'grey';
            if (obj.scanResult === 'success') { resultText = 'Succès'; resultColor = 'green'; }
            else if (obj.scanResult === 'not_found') { resultText = 'Non trouvé'; resultColor = 'orange'; }
            else if (obj.scanResult === 'error') { resultText = 'Erreur Scan'; resultColor = 'red'; }
            
            return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
                <ControlButton
                onClick={() => handler(obj.id, 'simulate_scan')}
                disabled={obj.status === 'Scanning'}> 
                <FaBarcode /> Simuler Scan
                </ControlButton>
                {obj.lastScan && (
                <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px' }}>
                    Dernier scan: {new Date(obj.lastScan).toLocaleString()}
                    </ValueDisplay>
                )}
                {obj.scanResult && (
                <div style={{ marginTop: '5px' }}>
                    Résultat: <span style={{ color: resultColor, fontWeight: 'bold' }}>{resultText}</span>
                    {obj.scanResult === 'success' && obj.lastScannedItem && (
                    <div style={{ fontSize: '0.8em' }}>
                        Item: {obj.lastScannedItem.title} ({obj.lastScannedItem.id})
                </div>
                    )}
                </div>
                )}
            </ObjectControls>
            );
        }
        return null;

        case 'Borne':
        if (obj.id === 'borne_recharge') {
            const isCharging = obj.status === 'En charge';
            const isOutOfService = obj.status === 'Hors service';
            let statusColor = isOutOfService ? 'grey' : (isCharging ? 'orange' : 'green');

            return (
            <ObjectControls>
                <ValueDisplay style={{ color: statusColor, fontWeight: 'bold' }}>État: {obj.status}</ValueDisplay>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_charge_start')} disabled={isCharging || isOutOfService}>
                    <FaChargingStation /> Démarrer Charge
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'simulate_charge_end')} disabled={!isCharging || isOutOfService}>
                    Arrêter Charge
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'toggle_service_status')} style={{backgroundColor: isOutOfService ? '#4CAF50' : '#ffcc00'}}>
                    {isOutOfService ? 'Remettre en service' : 'Mettre Hors Service'}
                </ControlButton>
                </div>
            </ObjectControls>
            );
        }
        if (obj.id === 'bornes_pret') {
            const isAuthenticated = obj.authState === 'authenticated';
            let authStateText = 'Inactif';
            if (obj.authState === 'authenticated') authStateText = 'Authentifié';
            else if (obj.authState === 'failed') authStateText = 'Échec';

            return (
            <ObjectControls>
                <ValueDisplay>État Borne: {obj.status}</ValueDisplay>
                    <ValueDisplay>
                Authentification: <span style={{ fontWeight: 'bold', color: isAuthenticated ? 'green' : (obj.authState === 'failed' ? 'red' : 'grey') }}>{authStateText}</span>
                    </ValueDisplay>
                {!isAuthenticated && (
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                    <ControlButton onClick={() => handler(obj.id, 'simulate_auth', true)}>
                    <FaUserCheck /> Simuler Auth Réussie
                    </ControlButton>
                    <ControlButton onClick={() => handler(obj.id, 'simulate_auth', false)}>
                    <FaUserTimes /> Simuler Auth Échouée
                    </ControlButton>
                </div>
                )}
                {isAuthenticated && (
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                    <ControlButton onClick={() => handler(obj.id, 'simulate_transaction', 'loan')}>
                    <FaBookReader /> Simuler Prêt
                    </ControlButton>
                    <ControlButton onClick={() => handler(obj.id, 'simulate_transaction', 'return')}>
                    <FaBookMedical /> Simuler Retour
                    </ControlButton>
                </div>
                )}
                {obj.lastTransactionDetails && obj.lastTransactionDetails.type && (
                    <ValueDisplay style={{ fontSize: '0.8em', marginTop: '5px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                    Dernière transac: {obj.lastTransactionDetails.type === 'loan' ? 'Prêt' : 'Retour'} de {obj.lastTransactionDetails.itemId} par {obj.lastTransactionDetails.userId} le {new Date(obj.lastTransaction).toLocaleString()}
                </ValueDisplay>
                )}
            </ObjectControls>
            );
        }
        return null;

        case 'Securite':
        if (obj.id === 'detecteur_rfid') {
            const isAlarm = obj.status === 'Alarme';
            return (
            <ObjectControls>
                <ValueDisplay style={{ color: isAlarm ? 'red' : 'inherit', fontWeight: isAlarm ? 'bold' : 'normal' }}>
                État: {obj.status} {isAlarm && <FaBell title="Alarme Antivol!" />}
                </ValueDisplay>
                {isAlarm && obj.lastDetection && (
                <ValueDisplay style={{ fontSize: '0.8em', color: 'red' }}>
                    Alarme déclenchée: {new Date(obj.lastDetection).toLocaleString()}
                </ValueDisplay>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_rfid_alarm')} disabled={isAlarm}>
                    Simuler Alarme Antivol
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_rfid_alarm')} disabled={!isAlarm} style={{ backgroundColor: isAlarm ? '#4CAF50' : '#cccccc' }}>
                    Réinitialiser Alarme
                </ControlButton>
                </div>
            </ObjectControls>
            );
        }
        if (obj.id === 'alarme_incendie') {
            const isAlarm = obj.status === 'Alarme Incendie';
            return (
            <ObjectControls>
                <ValueDisplay style={{ color: isAlarm ? 'red' : 'green', fontWeight: 'bold' }}>
                État: {obj.status} {isAlarm && <FaFire title="Alarme Incendie!" />}
                </ValueDisplay>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_fire_alarm')} disabled={isAlarm}>
                    Simuler Alarme Incendie
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_fire_alarm')} disabled={!isAlarm} style={{ backgroundColor: isAlarm ? '#4CAF50' : '#cccccc' }}>
                    Réinitialiser Alarme
                </ControlButton>
                </div>
            </ObjectControls>
            );
        }
        return null;

        case 'Barriere':
        return (
            <ObjectControls>
            <ValueDisplay style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                État actuel : {obj.status}
            </ValueDisplay>
            <ControlButton
                onClick={() => handleObjectControl(obj.id, 'barriere', obj.status !== 'Ouverte')}
                style={{ width: '100%', padding: '10px', fontSize: '1em' }} // Larger button
            >
                {obj.status === 'Ouverte' ? 
                <><FaCarAlt style={{ marginRight: '8px' }} /> Fermer la barrière</> : 
                <><FaCarAlt style={{ marginRight: '8px' }} /> Ouvrir la barrière</>
                }
            </ControlButton>
            </ObjectControls>
        );

        case 'Grille':
        return (
            <ObjectControls>
            <ValueDisplay style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                État actuel : {obj.status}
            </ValueDisplay>
            <ControlButton
                onClick={() => handleObjectControl(obj.id, 'grille', obj.status !== 'Ouverte')}
                style={{ width: '100%', padding: '10px', fontSize: '1em' }} // Larger button
            >
                {obj.status === 'Ouverte' ? 
                <><FaDoorClosed style={{ marginRight: '8px' }} /> Fermer la grille principale</> : 
                <><FaDoorOpen style={{ marginRight: '8px' }} /> Ouvrir la grille principale</>
                }
            </ControlButton>
            </ObjectControls>
        );

        case 'Projecteur':
        return (
            <ObjectControls>
            <ToggleButton 
                active={obj.status === 'Allumé'}
                onClick={() => handler(obj.id, 'light', obj.status !== 'Allumé')}>
                {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
            </ToggleButton>
            </ObjectControls>
        );

        case 'Store':
        return (
            <ObjectControls>
            <RangeSlider
                type="range"
                min="0"
                max="100"
                step="1"
                value={obj.position || 0}
                onChange={(e) => handler(obj.id, 'store_position', e.target.value)}
            />
            <ValueDisplay>Position: {obj.position || 0}%</ValueDisplay>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'store_position', 0)}>
                Fermer complètement
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'store_position', 100)}>
                Ouvrir complètement
                </ControlButton>
            </div>
            </ObjectControls>
        );

        case 'Detecteur':
        if (obj.id === 'detecteur_fumee') {
            const isSmokeDetected = obj.status === 'Fumée détectée';
        return (
            <ObjectControls>
                <ValueDisplay style={{ color: isSmokeDetected ? 'orange' : 'green', fontWeight: 'bold' }}>
                État: {obj.status} {isSmokeDetected && <FaSmog title="Fumée détectée!" />}
                </ValueDisplay>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_smoke_detection')} disabled={isSmokeDetected}>
                    Simuler Détection Fumée
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'reset_smoke_detector')} disabled={!isSmokeDetected} style={{ backgroundColor: isSmokeDetected ? '#4CAF50' : '#cccccc' }}>
                    Réinitialiser Détecteur
                </ControlButton>
                </div>
            </ObjectControls>
        );
        }
        if (obj.id === 'detecteur_gaz') {
            const batteryLow = obj.batteryLevel < obj.batteryLowThreshold;
            const isAlert = obj.status === 'Alerte';
            const isInactive = obj.status === 'Inactif';

            let statusColor = 'inherit';
            if (isAlert) statusColor = 'red';
            else if (isInactive) statusColor = 'grey';
            else if (batteryLow) statusColor = 'orange';

            return (
            <ObjectControls>
                <ValueDisplay style={{ color: statusColor }}>
                État: {obj.status}
                {isAlert && <FaSkullCrossbones title="Alerte Gaz!" />}
                {isInactive && <span> (Désactivé)</span>}
                </ValueDisplay>
                <ValueDisplay style={{ color: batteryLow ? 'orange' : 'inherit' }}>
                Batterie: {obj.batteryLevel}% {batteryLow && <FaExclamationTriangle title="Batterie faible" />}
                </ValueDisplay>
                {isAlert && obj.detectedGases.length > 0 && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                    Gaz détecté(s): {obj.detectedGases.join(', ')}
                </div>
                )}
                {isAlert && obj.lastAlert && (
                    <ValueDisplay style={{ fontSize: '0.8em', color: 'red' }}>
                    Alerte depuis: {new Date(obj.lastAlert).toLocaleString()}
                    </ValueDisplay>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ToggleButton
                    active={obj.status !== 'Inactif'}
                    onClick={() => handler(obj.id, 'detector_toggle', obj.status === 'Inactif')}>
                    {obj.status === 'Inactif' ? 'Activer' : 'Désactiver'}
                </ToggleButton>
                    <ControlButton
                    onClick={() => handler(obj.id, 'simulate_gas_detection')}
                    disabled={isAlert || isInactive}>
                    <FaGasPump /> Simuler Détection
                    </ControlButton>
                    <ControlButton
                    onClick={() => handler(obj.id, 'reset_gas_alert')}
                    disabled={!isAlert}
                    style={{ backgroundColor: isAlert ? '#4CAF50' : '#cccccc' }}>
                    Réinitialiser Alerte
                    </ControlButton>
                </div>
            </ObjectControls>
            );
        }
        else {
        return (
            <ObjectControls>
            <ValueDisplay>État: {obj.status}</ValueDisplay>
            </ObjectControls>
        );
        }

        case 'Affichage':
        if (obj.id === 'affichage_parking') {
            const free = obj.freeSpots !== undefined ? obj.freeSpots : 'N/A';
            const total = obj.totalSpots !== undefined ? obj.totalSpots : 'N/A';
            const color = (free === 0 || free === 'N/A') ? 'red' : 'green';

            return (
            <ObjectControls>
                <ValueDisplay style={{ fontSize: '1.2em', fontWeight: 'bold', color: color }}>
                Places Libres: {free} / {total}
                </ValueDisplay>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <ControlButton onClick={() => handler(obj.id, 'simulate_car_enter')} disabled={free === 0 || free === 'N/A'}>
                    <FaCar /> Entrée Voiture
                </ControlButton>
                <ControlButton onClick={() => handler(obj.id, 'simulate_car_leave')} disabled={free === total || free === 'N/A'}>
                    <FaCar style={{transform: 'scaleX(-1)'}}/> Sortie Voiture
                </ControlButton>
                </div>
            </ObjectControls>
            );
        }
        if (obj.id === 'score_board') {
            return (
              <ObjectControls>
                <ToggleButton
                  active={obj.status === 'Allumé'}
                  onClick={() => handler(obj.id, 'scoreboard_toggle', !obj.status === 'Allumé')}
                >
                  {obj.status === 'Allumé' ? 'Éteindre' : 'Allumer'}
                </ToggleButton>

                {obj.status === 'Allumé' && (
                  <>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <ValueDisplay>
                        Score: {obj.score.home} - {obj.score.away}
                      </ValueDisplay>
                      
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <div>
                          <ControlButton onClick={() => handler(obj.id, 'score_increment', 'home:1')}>
                            +1 Local
                          </ControlButton>
                          <ControlButton onClick={() => handler(obj.id, 'score_increment', 'home:2')}>
                            +2 Local
                          </ControlButton>
                        </div>
                        <div>
                          <ControlButton onClick={() => handler(obj.id, 'score_increment', 'away:1')}>
                            +1 Visiteur
                          </ControlButton>
                          <ControlButton onClick={() => handler(obj.id, 'score_increment', 'away:2')}>
                            +2 Visiteur
                          </ControlButton>
                        </div>
                      </div>

                      <ToggleButton
                        active={obj.autoMode}
                        onClick={() => handler(obj.id, 'scoreboard_auto', !obj.autoMode)}
                        style={{ marginTop: '10px' }}
                      >
                        {obj.autoMode ? 'Désactiver Auto' : 'Activer Auto'}
                      </ToggleButton>

                      <ControlButton 
                        onClick={() => handler(obj.id, 'score_reset')}
                        style={{ marginTop: '10px', backgroundColor: '#ff4444', color: 'white' }}
                      >
                        Réinitialiser Score
                      </ControlButton>
                    </div>
                  </>
                )}
              </ObjectControls>
            );
          }
          return null;
        const currentInputValue = tempInputValues[obj.id] !== undefined ? tempInputValues[obj.id] : (obj.message || '');

        return (
            <ObjectControls>
            <ValueDisplay>Message actuel: "{obj.message || 'Aucun'}"</ValueDisplay>
                <input
                type="text" 
                value={currentInputValue}
                onChange={(e) => setTempInputValues(prev => ({ ...prev, [obj.id]: e.target.value }))} 
                placeholder="Nouveau message..." 
                style={{ margin: '10px 0', padding: '8px', width: 'calc(100% - 16px)', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <ControlButton onClick={() => { 
                handler(obj.id, 'update_message', currentInputValue); 
            }}>
                Mettre à jour le message
            </ControlButton>
            </ObjectControls>
        );

        default:
        if (obj.id === 'detecteur_parking') {
            const statusText = obj.status === 'Actif' ? 'Place Occupée' : 'Place Libre';
            const statusColor = obj.status === 'Actif' ? 'orange' : 'green';
            return <ObjectControls><ValueDisplay style={{ color: statusColor, fontWeight: 'bold' }}>État: {statusText}</ValueDisplay></ObjectControls>;
        }
        if (obj.id === 'acces_parking') {
            return (
            <ObjectControls>
                <ValueDisplay>État: {obj.status}</ValueDisplay>
                <ControlButton onClick={() => handler(obj.id, 'simulate_access_request')}>
                Simuler Demande d'Accès
                </ControlButton>
            </ObjectControls>
            );
        }
        return <ObjectControls><ValueDisplay>État: {obj.status}</ValueDisplay></ObjectControls>;
    }
};