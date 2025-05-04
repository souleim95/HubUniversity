/*
 * Composant GestionPage : Interface d'administration des objets connectés
 * 
 * Fonctionnalités principales :
 * - Gestion CRUD complète des objets connectés (création, lecture, modification, suppression)
 * - Filtrage par catégorie (salles, école, parking)
 * - Surveillance en temps réel des statuts et alertes
 * - Génération de rapports et statistiques
 * - Gestion des réservations de salles
 * 
 * Structure du code :
 * 1. Déclaration des états (useState)
 * 2. Fonctions utilitaires et gestionnaires d'événements
 * 3. Hooks d'effets (useEffect)
 * 4. Rendu du composant
 */

// Import des dépendances et composants nécessaires
import React, { useState } from 'react';
import { dataObjects, categories } from '../data/projectData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AdminContainer,
  AdminHeader,
  AdminTitle,
  AdminSubtitle,
  Section,
  SectionHeader,
  SectionTitle,
  ActionButton,
  Grid,
  Card,
  CardTitle,
  StatusBadge,
  ModalOverlay,
  ModalContent,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup,
  SecondaryButton,
  PrimaryButton,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  TabsContainer,
  TabsList,
  Tab,
  AlertBanner,
  TableCell,
  Table,
  TableHeaderCell,
  TableHeader,
  TableRow,
  ExportButton,
} from '../styles/AdminStyles';
import { FaTools, FaCalendar, FaExclamationTriangle, FaPlus, FaTrash, FaChartBar, FaDownload } from 'react-icons/fa';
import { useGestionState, categoryToTypeMap } from '../hooks/useGestion';

// Dans useGestion.js, définir les types configurables et leurs paramètres
export const configurableTypes = {
  'Chauffage': true,     // Temperature, mode
  'Éclairage': true,     // Intensité, horaires, mode
  'Ventilation': true,   // Vitesse, CO2, mode
  'Caméra': true,        // Résolution, détection, angle
  'Porte': true,         // Mode d'accès, horaires, sécurité
  'Panneau': true,       // Type affichage, luminosité, défilement
  'Audio': true,         // Volume, mode
  'Store': true,         // Position, mode automatique
  
  // Objets non configurables
  'Salle': false,
  'Distributeur': false,
  'Scanner': false,
  'Borne': false,
  'Securite': false,
  'Detecteur': false,
  'Barriere': false,
  'Grille': false,
  'Cafetiere': false,
  'Microwave': false,
  'AirSensor': false,
  'Dishwasher': false,
  'Projecteur': false
};

const convertToCSV = (data) => {
  if (!data || !data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => 
      typeof obj[header] === 'string' ? `"${obj[header]}"` : obj[header]
    ).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csv, filename) => {
  if (!csv) {
    toast.error("Aucune donnée à exporter");
    return;
  }
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function GestionPage() {
  const {
    generateReports, // Déjà importé d'ici
    handleExportReport,
    handleEditObject,
    handleObjectSubmit,
    handleCategoryChange,
    handleAddObject,
    handleAddReservation,
    handleEditReservation,
    handleDeleteReservation,
    handleRequestDeletion,
    handleCreateAlert,
    handleToggleStatus,
    handleOpenSettings,
    handleReservationSubmit,
    isInefficient,
    isNameUnique,
    handleSaveSettings,
    initialSettings,         // ← ajouté
    objects, setObjects,
    showObjectModal, setShowObjectModal,
    inactiveCount,
    objectHistories,
    showAlert, setShowAlert,
    alertMessage,
    showConfirmation, setShowConfirmation,
    confirmationMessage,
    confirmationAction, 
    selectedForChart, setSelectedForChart,
    editingObject, setEditingObject,
    objectFormData, setObjectFormData,
    objectSettings, setObjectSettings,
    editingSettingsFor, setEditingSettingsFor,
    reservationFormData, setReservationFormData,
    showReservationModal, setShowReservationModal,
    reservations, 
    showAlertModal, setShowAlertModal,
    selectedAlert, 
    alerts, reports,
    selectedReport, setSelectedReport,
    selectedCategory,
    allObjects,
    timeFilter,
    setTimeFilter,
    historyTimeFilter, 
    setHistoryTimeFilter,
    chartType, setChartType,
  } = useGestionState();

  // Gestionnaires d'événements avec toast
  const handleObjectAction = (object, action) => {
    switch(action) {
      case 'submit':
        // La validation se fait avant la soumission
        if (!isNameUnique(object.name)) {
            toast.error("Un objet avec ce nom existe déjà");
            return;
        }
        handleObjectSubmit(object);
        toast.success(`L'objet ${object.name} a été ${editingObject ? 'modifié' : 'créé'} avec succès`);
        break;
        
      case 'toggle':
        handleToggleStatus(object);
        toast.info(`Statut de ${object.name} changé en ${object.status === 'active' ? 'inactif' : 'actif'}`);
        break;
        
      case 'alert':
        handleCreateAlert(object);
        toast.warning(`Une alerte a été créée pour ${object.name}`);
        break;
        
      case 'settings':
        handleOpenSettings(object);
        // Ne pas afficher de toast ici, attendre la sauvegarde
        break;

      case 'saveSettings':
        // Ajouter dans le bouton Enregistrer du modal de configuration
        handleSaveSettings(object);
        toast.success(`Configuration de ${object.name} enregistrée avec succès`);
        break;

      case 'changeCategory':
        // Ajouter cette validation lors du changement de catégorie
        toast.info(`Catégorie de ${object.name} changée en ${object.category}`);
        break;
    }
  };

  const handleReservationDelete = (id) => {
    handleDeleteReservation(id);
    toast.success('Réservation supprimée avec succès');
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle style={{ color: '#f8f9fa' }}>Gestion des Objets Connectés</AdminTitle>
        <AdminSubtitle style={{ color: '#f8f9fa' }}>Gestion des objets, des réservations de salles et des alertes</AdminSubtitle>
      </AdminHeader>

      {/* Statistiques de la page */}
      <StatsGrid>
        <StatCard>
          <StatValue>{objects.length}</StatValue>
          <StatLabel>Objets Connectés</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{reservations.length}</StatValue>
          <StatLabel>Réservations de Salles</StatLabel>
        </StatCard>
        <StatCard>
        <StatValue>
        {(reports[selectedCategory] || []).reduce((total, item) => total + item.value, 0)} kWh
        </StatValue>

          <StatLabel>Consommation Énergétique</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Catégories */}
      <TabsContainer>
        <TabsList>
          {Object.keys(categories).map(categoryKey => (
            <Tab 
              key={categoryKey} 
              active={selectedCategory === categoryKey} 
              onClick={() => handleCategoryChange(categoryKey)}
            >
              {categories[categoryKey].name}
            </Tab>
          ))}
        </TabsList>
      </TabsContainer>

      {/* Gestion des objets */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaTools /> Objets Connectés
          </SectionTitle>
          <ActionButton onClick={handleAddObject}>
            <FaPlus /> Ajouter un objet
          </ActionButton>
        </SectionHeader>

        <Grid>
          {objects.map((object) => (
            <Card key={object.id} >
              <CardTitle>{object.name}</CardTitle>
              <p><strong>Zone :</strong> {object.id}</p>
              <br></br>
              <p><strong>Statut :</strong> <StatusBadge status={object.status}>{object.status}</StatusBadge></p>
              {isInefficient(object) && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                  ⚠️ Inefficace : paramètres à optimiser
                </p>
              )}
              <ButtonGroup>
                <SecondaryButton onClick={() => handleObjectAction(object, 'alert')}>
                  Créer une alerte
                </SecondaryButton>
                <PrimaryButton onClick={() => handleRequestDeletion(object)}>
                  <FaTrash /> Demander la suppression
                </PrimaryButton>
                {configurableTypes[object.type] && (
                  <SecondaryButton onClick={() => handleObjectAction(object, 'settings')}>
                    Configurer
                  </SecondaryButton>
                )}
                <SecondaryButton onClick={() => setSelectedForChart(object)}>
                  Voir l'historique
                </SecondaryButton>
                <SecondaryButton onClick={() => handleEditObject(object)}>
                  Modifier
                </SecondaryButton>
                <SecondaryButton onClick={() => handleObjectAction(object, 'toggle')}>
                  {object.status === 'active' ? 'Désactiver' : 'Activer'}
                </SecondaryButton>
              </ButtonGroup>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaExclamationTriangle /> Alertes
          </SectionTitle>
        </SectionHeader>

        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Objet</TableHeaderCell>
              <TableHeaderCell>Message</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{dataObjects.find(object => object.id === alert.objectId)?.name}</TableCell>
                <TableCell>{alert.message}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaCalendar /> Réservations de Salles
          </SectionTitle>
          <ActionButton onClick={handleAddReservation}>
            <FaPlus /> Ajouter une réservation
          </ActionButton>
        </SectionHeader>

        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Salle</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Heure</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.room}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <SecondaryButton onClick={() => handleEditReservation(reservation)}>Modifier</SecondaryButton>
                    <PrimaryButton onClick={() => handleReservationDelete(reservation.id)}>Supprimer</PrimaryButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionHeader style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
            <SectionTitle>
              <FaChartBar /> Rapports d'Utilisation & Efficacité
            </SectionTitle>
            <ButtonGroup>
              <ExportButton onClick={() => handleExportReport('total')}>
                <FaDownload /> Exporter conso
              </ExportButton>
              <ExportButton onClick={() => {
                // Filtrer les objets inactifs
                const inactiveObjects = objects.filter(obj => obj.status === 'inactive' || obj.status === 'Inactif');
                
                if (inactiveObjects.length === 0) {
                  toast.error("Aucun objet inactif à exporter");
                  return;
                }

                const csv = convertToCSV(inactiveObjects.map(obj => ({
                  nom: obj.name,
                  type: obj.type,
                  status: obj.status,
                  zone: obj.id,
                  derniere_activite: new Date().toLocaleDateString()
                })));
                
                downloadCSV(csv, 'objets_inactifs.csv');
              }}>
                <FaDownload /> Exporter objets inactifs
              </ExportButton>
            </ButtonGroup>
          </div>
        </SectionHeader>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <FormGroup style={{ width: '200px' }}>
            <Label>Type de Consommation</Label>
            <Select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="total">Conso Totale</option>
              <option value="salles">Conso Salles</option>
              <option value="ecole">Conso École</option>
              <option value="parking">Conso Parking</option>
            </Select>
          </FormGroup>

          <FormGroup style={{ width: '200px' }}>
            <Label>Période</Label>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </Select>
          </FormGroup>

          <FormGroup style={{ width: '200px' }}>
            <Label>Type de graphique</Label>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Ligne</option>
              <option value="bar">Barres</option>
            </Select>
          </FormGroup>
        </div>

        <StatsGrid>
          <StatCard>
            <StatValue>
            {(reports[selectedReport] || []).reduce((sum, e) => sum + e.value, 0)} kWh
            </StatValue>
            <StatLabel>Consommation Totale</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{inactiveCount}</StatValue>
            <StatLabel>Objets Inactifs</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle style={{ marginTop: '2rem' }}>Graphique de consommation</SectionTitle>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' ? (
            <LineChart data={reports[selectedReport]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis 
                label={{ value: 'Consommation (kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} kWh`, 'Consommation']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Consommation"
              />
            </LineChart>
          ) : (
            <BarChart data={reports[selectedReport]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis
                label={{ value: 'Consommation (kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} kWh`, 'Consommation']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                name="Consommation"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Section>

      {/* Modal de création d'objet */}
      {showObjectModal && (
        <ModalOverlay onClick={() => setShowObjectModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>{editingObject ? 'Modifier' : 'Ajouter'} un objet connecté</SectionTitle>
            <form onSubmit={(e) => {
                e.preventDefault();
                const success = handleObjectSubmit(e);
                if (success) {
                    toast.success(`Objet ${editingObject ? 'modifié' : 'créé'} avec succès`);
                    setShowObjectModal(false);
                }
            }}>
              <FormGroup>
                <Label>Nom de l'objet</Label>
                <Input
                  type="text"
                  value={objectFormData.name}
                  onChange={(e) => setObjectFormData({ ...objectFormData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Catégorie</Label>
                <Select
                  value={objectFormData.category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    if (editingObject && newCategory !== objectFormData.category) {
                      toast.warning("Attention : Le changement de catégorie peut affecter les équipements associés");
                    }
                    setObjectFormData({
                      ...objectFormData,
                      category: newCategory,
                      type: categoryToTypeMap[newCategory][0] || ''
                    });
                  }}
                  disabled={!!editingObject}
                >
                  {Object.keys(categories).map((categoryKey) => (
                    <option key={categoryKey} value={categoryKey}>
                      {categories[categoryKey].name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Statut</Label>
                <Select
                  value={objectFormData.status}
                  onChange={(e) => setObjectFormData({ ...objectFormData, status: e.target.value })}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Type d’objet</Label>
                <Select
                  value={objectFormData.type}
                  onChange={(e) => setObjectFormData({ ...objectFormData, type: e.target.value })}
                >
                  {(categoryToTypeMap[objectFormData.category] || []).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Numéro</Label>
                <Input
                  type="text"
                  placeholder="Ex : 102"
                  value={objectFormData.numero}
                  onChange={(e) => setObjectFormData({ ...objectFormData, numero: e.target.value })}
                  required
                />
              </FormGroup>
              {objectFormData.type === 'Chauffage' && (
                <FormGroup>
                  <Label>Température cible (°C)</Label>
                  <Input
                    type="number"
                    min="10"
                    max="30"
                    value={objectFormData.targetTemp}
                    onChange={(e) => setObjectFormData({ ...objectFormData, targetTemp: e.target.value })}
                  />
                </FormGroup>
              )}
              {objectFormData.type === 'Éclairage' && (
                <FormGroup>
                  <Label>Plage horaire (ex: 08:00-18:00)</Label>
                  <Input
                    type="text"
                    value={objectFormData.brightnessSchedule}
                    onChange={(e) => setObjectFormData({ ...objectFormData, brightnessSchedule: e.target.value })}
                    placeholder="08:00-18:00"
                  />
                </FormGroup>
              )}
              <ButtonGroup>
                <SecondaryButton type="button" onClick={() => {
                  setShowObjectModal(false);
                  setEditingObject(null);
                }}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton type="submit">
                  {editingObject ? 'Modifier' : 'Ajouter'}
                </PrimaryButton>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {showReservationModal && (
        <ModalOverlay onClick={() => setShowReservationModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Ajouter une réservation</SectionTitle>
            <form onSubmit={handleReservationSubmit}>
              <FormGroup>
                <Label>Salle</Label>
                <Select
                  value={reservationFormData.room}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, room: e.target.value })}
                >
                  {allObjects.filter(obj => obj.type === 'Salle').map((object) => (
                    <option key={object.id} value={object.name}>{object.name}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={reservationFormData.date}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, date: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={reservationFormData.time}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, time: e.target.value })}
                  required
                />
              </FormGroup>
              <ButtonGroup>
                <SecondaryButton type="button" onClick={() => setShowReservationModal(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton type="submit">Réserver</PrimaryButton>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal des alertes */}
      {showAlertModal && (
        <ModalOverlay onClick={() => setShowAlertModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Créer une alerte pour {selectedAlert?.name}</h2>
            <AlertBanner type="warning">
              <FaExclamationTriangle />
              <div>
                <strong>Problème détecté</strong>
                <div>Veuillez contacter un administrateur.</div>
              </div>
            </AlertBanner>
            <ButtonGroup>
              <SecondaryButton onClick={() => setShowAlertModal(false)}>Annuler</SecondaryButton>
              <PrimaryButton>Confirmer</PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {editingSettingsFor && (
        <ModalOverlay onClick={() => setEditingSettingsFor(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Configurer {editingSettingsFor.name}</SectionTitle>
            
            {/* Configuration pour Chauffage */}
            {editingSettingsFor.type === 'Chauffage' && (
              <>
                <FormGroup>
                  <Label>Température cible (°C)</Label>
                  <Input
                    type="number"
                    min="15"
                    max="30"
                    value={objectSettings.temperature}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      temperature: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mode</Label>
                  <Select
                    value={objectSettings.mode}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      mode: e.target.value
                    }))}
                  >
                    <option value="auto">Automatique</option>
                    <option value="eco">Éco</option>
                    <option value="confort">Confort</option>
                    <option value="horsgel">Hors-gel</option>
                  </Select>
                </FormGroup>
              </>
            )}

            {/* Configuration pour Éclairage */}
            {editingSettingsFor.type === 'Éclairage' && (
              <>
                <FormGroup>
                  <Label>Intensité (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={objectSettings.brightness}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      brightness: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mode d'éclairage</Label>
                  <Select
                    value={objectSettings.lightingMode}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      lightingMode: e.target.value
                    }))}
                  >
                    <option value="auto">Automatique</option>
                    <option value="manual">Manuel</option>
                    <option value="presence">Détection de présence</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Heure d'allumage</Label>
                  <Input
                    type="time"
                    value={objectSettings.startTime}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Heure d'extinction</Label>
                  <Input
                    type="time"
                    value={objectSettings.endTime}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      endTime: e.target.value
                    }))}
                  />
                </FormGroup>
              </>
            )}

            {/* Configuration pour Ventilation */}
            {editingSettingsFor.type === 'Ventilation' && (
              <>
                <FormGroup>
                  <Label>Vitesse (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={objectSettings.speed}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      speed: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mode</Label>
                  <Select
                    value={objectSettings.mode}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      mode: e.target.value
                    }))}
                  >
                    <option value="auto">Automatique</option>
                    <option value="manuel">Manuel</option>
                    <option value="boost">Boost</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Seuil CO2 (ppm)</Label>
                  <Input
                    type="number"
                    min="400"
                    max="2000"
                    value={objectSettings.co2Threshold}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      co2Threshold: e.target.value
                    }))}
                  />
                </FormGroup>
              </>
            )}

            {/* Configuration pour Store */}
            {editingSettingsFor.type === 'Store' && (
              <>
                <FormGroup>
                  <Label>Position (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={objectSettings.position}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      position: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mode</Label>
                  <Select
                    value={objectSettings.mode}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      mode: e.target.value
                    }))}
                  >
                    <option value="auto">Automatique</option>
                    <option value="manual">Manuel</option>
                    <option value="luminosite">Selon luminosité</option>
                  </Select>
                </FormGroup>
              </>
            )}

            {/* Configuration pour Audio */}
            {editingSettingsFor.type === 'Audio' && (
              <>
                <FormGroup>
                  <Label>Volume (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={objectSettings.volume}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      volume: e.target.value
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mode audio</Label>
                  <Select
                    value={objectSettings.audioMode}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      audioMode: e.target.value
                    }))}
                  >
                    <option value="stereo">Stéréo</option>
                    <option value="mono">Mono</option>
                    <option value="surround">Surround</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Source</Label>
                  <Select
                    value={objectSettings.source}
                    onChange={(e) => setObjectSettings(prev => ({
                      ...prev,
                      source: e.target.value
                    }))}
                  >
                    <option value="hdmi">HDMI</option>
                    <option value="bluetooth">Bluetooth</option>
                    <option value="aux">AUX</option>
                    <option value="usb">USB</option>
                  </Select>
                </FormGroup>
              </>
            )}

            <ButtonGroup>
              <SecondaryButton onClick={() => {
                if (JSON.stringify(initialSettings) !== JSON.stringify(objectSettings)) {
                  toast.warning("Les modifications non sauvegardées seront perdues");
                }
                setEditingSettingsFor(null);
              }}>
                Annuler
              </SecondaryButton>
              <PrimaryButton onClick={() => {
                handleObjectAction(editingSettingsFor, 'saveSettings');
                setEditingSettingsFor(null);
              }}>
                Enregistrer
              </PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Amélioration du graphique d'historique */}
      {selectedForChart && (
        <ModalOverlay onClick={() => setSelectedForChart(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <SectionTitle>Consommation de {selectedForChart.name}</SectionTitle>
            {objectHistories[selectedForChart.id]?.length > 0 ? (
              <>
                <FormGroup style={{ width: '200px', marginBottom: '1rem' }}>
                  <Label>Période</Label>
                  <Select
                    value={historyTimeFilter}
                    onChange={(e) => setHistoryTimeFilter(e.target.value)}
                  >
                    <option value="day">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </Select>
                </FormGroup>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={objectHistories[selectedForChart.id]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis 
                      label={{ value: 'Consommation (kWh)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} kWh`, 'Consommation']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Consommation"
/>
                  </LineChart>
                </ResponsiveContainer>
                <StatCard style={{ marginTop: '1rem' }}>
                  <StatValue>
                    {objectHistories[selectedForChart.id].reduce((sum, e) => sum + e.value, 0)} kWh
                  </StatValue>
                  <StatLabel>Consommation Totale</StatLabel>
                </StatCard>
              </>
            ) : (
              <p>Aucune donnée disponible pour cet objet.</p>
            )}
            <ButtonGroup style={{ marginTop: '1rem' }}>
              <PrimaryButton onClick={() => setSelectedForChart(null)}>Fermer</PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {showAlert && (
        <ModalOverlay onClick={() => setShowAlert(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Alerte</SectionTitle>
            <p>{alertMessage}</p>
            <ButtonGroup>
              <PrimaryButton onClick={() => setShowAlert(false)}>OK</PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {showConfirmation && (
        <ModalOverlay onClick={() => setShowConfirmation(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Confirmation</SectionTitle>
            <p>{confirmationMessage}</p>
            <ButtonGroup>
              <SecondaryButton onClick={() => setShowConfirmation(false)}>Annuler</SecondaryButton>
              <PrimaryButton onClick={() => confirmationAction()}>Confirmer</PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
}

export default GestionPage;