/*
 * Composant CampusMap : Carte interactive du campus
 * 
 * Fonctionnalités principales :
 * - Visualisation des objets connectés par type
 * - Navigation interactive entre les différentes catégories
 * - Interface de type "carte retournable" pour plus d'informations
 * - Navigation conditionnelle vers le tableau de bord
 */

// Imports et configuration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataObjects, equipments } from '../data/projectData';
import {
  MapSection,
  MapContainer,
  ObjectCard,
  CardInner,
  ObjectFront,
  ObjectBack
} from '../styles/CampusMapStyles';

import { useCampusMap } from '../hooks/useCampusMap';

function CampusMap () {
  const {
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
    navigate,
    handleCardClick, handleCardDoubleClick, handleMapMouseDown, handleMapMouseMove, handleMapMouseUp,
    getObjectImage, getObjectPosition, getObjectsByBuilding, getObjectIcon
  } = useCampusMap();

  // Rendu du composant
  return (
    <MapSection id="campus-section">
      <div className="campus-container">
        {/* Titre */}
        <div>
          <h2>Campus Connecté</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '20px' 
          }}>
            <button 
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgb(15, 110, 173)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            >
              {viewMode === 'list' ? 'Vue Carte' : 'Vue Liste'}
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          // Vue Liste
          <>
            {/* Boutons de catégories */}
            <div>
              <div >
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedType(category.name)}
                    style={{
                      padding: '16px',
                      backgroundColor: selectedType === category.name 
                        ? 'rgb(15, 110, 173)' 
                        : '#ffffff',
                      color: selectedType === category.name 
                        ? '#ffffff' 
                        : '#09090B',
                      border: '1px solid',
                      borderColor: selectedType === category.name 
                        ? 'rgb(15, 110, 173)' 
                        : '#E4E4E7',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedType === category.name
                        ? '0 0 0 1px rgba(24, 24, 27, 0.05), 0 1px 2px rgba(24, 24, 27, 0.1)'
                        : '0 0 0 1px rgba(24, 24, 27, 0.05)',
                      width: '100%',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedType !== category.name) {
                        e.target.style.backgroundColor = '#F4F4F5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedType !== category.name) {
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Container des objets */}
            <MapContainer>
              {categories.find(cat => cat.name === selectedType)?.items.map((itemId) => {
                const object = dataObjects.find(obj => obj.id === itemId) || 
                              Object.values(equipments).flat().find(eq => eq.id === itemId);
                if (!object) return null;
                
                return (
                  <ObjectCard 
                    key={object.id}
                    onClick={() => handleCardClick(object)}
                    onDoubleClick={() => handleCardDoubleClick(object)}
                  >
                    <CardInner flipped={flippedCard === object.id}>
                      <ObjectFront>
                        <img
                          src={getObjectImage(object)}
                          alt={object.name}
                          style={{ 
                            width: '100%', 
                            height: '70%', 
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                        <h4>{object.name}</h4>
                      </ObjectFront>
                      <ObjectBack>
                        <p>{object.description || 'Ajoutez une note personnalisée ici'}</p>
                        <p style={{ 
                          marginTop: '10px', 
                          fontSize: '0.8rem', 
                          color: '#1a73e8' 
                        }}>
                          Double-cliquez pour accéder aux détails
                        </p>
                      </ObjectBack>
                    </CardInner>
                  </ObjectCard>
                );
              })}
            </MapContainer>
          </>
        ) : (
          // Vue carte améliorée
          <>
            {/* Filtres de catégories en haut de l'écran */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '20px',
              justifyContent: 'center'
            }}>
              {categories.map((category, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedType(category.name)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedType === category.name 
                      ? 'rgb(15, 110, 173)' 
                      : '#ffffff',
                    color: selectedType === category.name 
                      ? '#ffffff' 
                      : '#09090B',
                    border: '1px solid',
                    borderColor: selectedType === category.name 
                      ? 'rgb(15, 110, 173)' 
                      : '#E4E4E7',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedType !== category.name) {
                      e.target.style.backgroundColor = '#F4F4F5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedType !== category.name) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '700px', 
                border: '1px solid #ccc',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
            >
              {/* SVG du campus avec tous les bâtiments */}
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 1000 700" 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 161,
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
              >
                {/* Espaces verts */}
                <ellipse cx="200" y="80" rx="120" ry="60" fill="#c8e6c9" stroke="#666" strokeWidth="1" />
                <ellipse cx="800" y="80" rx="120" ry="60" fill="#c8e6c9" stroke="#666" strokeWidth="1" />
                <ellipse cx="500" y="500" rx="100" ry="50" fill="#c8e6c9" stroke="#666" strokeWidth="1" />
                
                {/* Routes principales */}
                <path d="M50,200 H950" stroke="#888" strokeWidth="10" strokeDasharray="10,5" />
                <path d="M50,400 H950" stroke="#888" strokeWidth="10" strokeDasharray="10,5" />
                <path d="M300,50 V650" stroke="#888" strokeWidth="10" strokeDasharray="10,5" />
                <path d="M700,50 V650" stroke="#888" strokeWidth="10" strokeDasharray="10,5" />
                
                {/* Bâtiments */}
                <rect 
                  x="100" y="120" width="150" height="120" 
                  fill={selectedBuilding === "École" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "École" ? "#1976d2" : "#666"} 
                  strokeWidth="2" 
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "École" ? null : "École");
                    setSelectedType("Objets école");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="400" y="120" width="200" height="120" 
                  fill={selectedBuilding === "Gymnase" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Gymnase" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Gymnase" ? null : "Gymnase");
                    setSelectedType("Équipements salle_sport");
                  }} 
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="750" y="120" width="150" height="120" 
                  fill={selectedBuilding === "Bibliothèque" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Bibliothèque" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Bibliothèque" ? null : "Bibliothèque");
                    setSelectedType("Équipements biblio");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="100" y="300" width="150" height="120" 
                  fill={selectedBuilding === "Réfectoire" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Réfectoire" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Réfectoire" ? null : "Réfectoire");
                    setSelectedType("Équipements refectoire");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="400" y="300" width="200" height="120" 
                  fill={selectedBuilding === "Laboratoire" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Laboratoire" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Laboratoire" ? null : "Laboratoire");
                    setSelectedType("Équipements labo_chimie");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="750" y="300" width="150" height="120" 
                  fill={selectedBuilding === "Salle info" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Salle info" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Salle info" ? null : "Salle info");
                    setSelectedType("Équipements salle101");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                <rect 
                  x="400" y="550" width="200" height="120" 
                  fill={selectedBuilding === "Amphithéâtre" ? "#bbdefb" : "#d1d9e6"} 
                  stroke={selectedBuilding === "Amphithéâtre" ? "#1976d2" : "#666"} 
                  strokeWidth="2"
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Amphithéâtre" ? null : "Amphithéâtre");
                    setSelectedType("Équipements amphiA");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Parking */}
                <rect 
                  x="750" y="550" width="200" height="120" 
                  stroke={selectedBuilding === "Parking" ? "#1976d2" : "#666"} 
                  strokeWidth="2" 
                  fill={selectedBuilding === "Parking" ? "#bbdefb" : "#aaaaaa"}
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding === "Parking" ? null : "Parking");
                    setSelectedType("Objets parking & extérieur");
                  }}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Étiquettes des bâtiments */}
                <text x="175" y="180" textAnchor="middle" fill="#333" fontWeight="bold">École</text>
                <text x="500" y="180" textAnchor="middle" fill="#333" fontWeight="bold">Gymnase</text>
                <text x="825" y="180" textAnchor="middle" fill="#333" fontWeight="bold">Bibliothèque</text>
                <text x="175" y="360" textAnchor="middle" fill="#333" fontWeight="bold">Réfectoire</text>
                <text x="500" y="360" textAnchor="middle" fill="#333" fontWeight="bold">Labo de chimie</text>
                <text x="825" y="360" textAnchor="middle" fill="#333" fontWeight="bold">Salle info</text>
                <text x="500" y="610" textAnchor="middle" fill="#333" fontWeight="bold">Amphithéâtre</text>
                <text x="850" y="610" textAnchor="middle" fill="#333" fontWeight="bold">Parking</text>
              </svg>
              
              {/* Placement amélioré des objets sur la carte */}
              {categories.map(category => {
                // Ne montrer les objets que si la catégorie est sélectionnée
                if (selectedType !== category.name && selectedType !== "Salles principales") return null;
                
                // Récupérer les objets de la catégorie
                const objects = category.items.map(itemId => {
                  return dataObjects.find(obj => obj.id === itemId) ||
                    Object.values(equipments).flat().find(eq => eq.id === itemId);
                }).filter(obj => obj !== undefined);
                
                // Filtrer par étage si applicable et par bâtiment sélectionné si nécessaire
                const filteredObjects = objects.filter(obj => {
                  // Filtre par étage
                  if (obj.floor !== undefined && floor !== obj.floor) {
                    return false;
                  }
                  
                  // Filtre par bâtiment sélectionné si un bâtiment est sélectionné
                  if (selectedBuilding) {
                    // Déterminer le bâtiment de l'objet selon son id ou sa catégorie
                    let objBuilding = "";
                    if (obj.location) {
                      objBuilding = obj.location;
                    } else if (category.name === "Objets école") {
                      objBuilding = "École";
                    } else if (category.name === "Équipements salle101"){
                      objBuilding = "Salle info";
                    } else if (category.name === "Équipements salle_sport") {
                      objBuilding = "Gymnase";
                    } else if (category.name === "Équipements biblio") {
                      objBuilding = "Bibliothèque";
                    } else if (category.name === "Équipements labo_chimie") {
                      objBuilding = "Laboratoire";
                    } else if (category.name === "Équipements refectoire") {
                      objBuilding = "Réfectoire";
                    } else if (category.name === "Équipements amphiA") {
                      objBuilding = "Amphithéâtre";
                    } else if (category.name === "Objets parking & extérieur") {
                      objBuilding = "Parking";
                    }
                    
                    return objBuilding === selectedBuilding;
                  }
                  
                  return true;
                });
                
                return filteredObjects.map((object, index) => {
                  // Calcul de la position optimisée basée sur la catégorie
                  const position = getObjectPosition(object, category, index, filteredObjects.length);
                  
                  // Icône personnalisée
                  const icon = getObjectIcon(object);
                  
                  return (
                    <div
                      key={object.id}
                      style={{
                        position: 'absolute',
                        left: `${position.x - 18}px`,
                        top: `${position.y - 18}px`,
                        width: '36px',
                        height: '36px',
                        backgroundColor: position.interior ? 'rgba(255,255,255,0.8)' : 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: position.interior 
                          ? '0 1px 3px rgba(0,0,0,0.12)' 
                          : '0 2px 5px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        border: position.interior 
                          ? '1px solid rgba(0,0,0,0.1)' 
                          : 'none',
                        transform: `scale(${flippedCard === object.id ? 1.1 : 1})`,
                      }}
                      onClick={() => handleCardDoubleClick(object)}
                      onMouseEnter={() => setFlippedCard(object.id)}
                      onMouseLeave={() => setFlippedCard(null)}
                    >
                      <span role="img" aria-label={object.name} style={{ fontSize: '18px' }}>{icon}</span>
                    </div>
                  );
                });
              })}
              
              {/* Sélecteur d'étage pour les bâtiments à plusieurs niveaux */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 30,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                padding: '5px'
              }}>
                <button onClick={() => setFloor(0)} 
                        style={{
                          backgroundColor: floor === 0 ? 'rgb(15, 110, 173)' : 'white', 
                          color: floor === 0 ? 'white' : 'black',
                          margin: '2px', padding: '5px 10px', border: 'none', borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                  RDC
                </button>
              </div>
              
              
              {/* Info-bulle pour l'objet survolé */}
              {flippedCard && (
                <div style={{
                  position: 'absolute',
                  top: '180px',
                  left: '85%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  zIndex: 20,
                  maxWidth: '300px',
                  textAlign: 'center'
                }}>
                  <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>
                    {dataObjects.find(obj => obj.id === flippedCard)?.name || 
                    Object.values(equipments).flat().find(eq => eq.id === flippedCard)?.name || 
                    "Objet inconnu"}
                  </p>
                  <p style={{margin: 0, fontSize: '0.9rem'}}>
                    {dataObjects.find(obj => obj.id === flippedCard)?.description || 
                    Object.values(equipments).flat().find(eq => eq.id === flippedCard)?.description || 
                    "Cliquez pour voir les détails"}
                  </p>
                </div>
              )}
              
              {/* Légende des icônes */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                zIndex: 20,
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Légende:</div>
                <div><span role="img" aria-label="éclairage" style={{marginRight: '5px'}}>💡</span> Éclairage</div>
                <div><span role="img" aria-label="caméra" style={{marginRight: '5px'}}>📹</span> Caméra</div>
                <div><span role="img" aria-label="capteur" style={{marginRight: '5px'}}>📡</span> Capteur</div>
                <div><span role="img" aria-label="parking" style={{marginRight: '5px'}}>🅿️</span> Parking</div>
                <div><span role="img" aria-label="alarme" style={{marginRight: '5px'}}>🚨</span> Alarme</div>
                <div><span role="img" aria-label="informatique" style={{marginRight: '5px'}}>💻</span> Informatique</div>
                <div><span role="img" aria-label="laboratoire" style={{marginRight: '5px'}}>🧪</span> Laboratoire</div>
                <div><span role="img" aria-label="amphithéâtre" style={{marginRight: '5px'}}>🎭</span> Amphithéâtre</div>
                <div><span role="img" aria-label="gymnase" style={{marginRight: '5px'}}>🏀</span> Gymnase</div>
              </div>
              
              {/* Contrôles de zoom */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <button 
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                ➕
                </button>
                <button 
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                 ➖
                </button>
                <button 
                  onClick={() => {
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  🔙
                </button>
              </div>
              
              {/* Instructions d'utilisation */}
              {!selectedBuilding && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  fontSize: '14px',
                  pointerEvents: 'none'
                }}>
                  <p style={{ margin: 0 }}>Cliquez sur un bâtiment pour voir ses équipements</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MapSection>
  );
};

export default CampusMap;
