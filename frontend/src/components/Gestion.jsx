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
import React from 'react';
import { dataObjects, categories } from '../data/projectData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

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
  ExportButton
} from '../styles/AdminStyles';
import { FaTools, FaCalendar, FaExclamationTriangle, FaPlus, FaTrash, FaChartBar,FaDownload } from 'react-icons/fa';
import { useGestionState, categoryToTypeMap } from '../hooks/useGestion';


function GestionPage() {

  // Externalisation de nos const et de nos states dans un fichier constGestion.js
  const {
    generateReports, handleExportReport,
    handleEditObject, handleObjectSubmit,
    handleCategoryChange, handleAddObject,
    handleAddReservation, handleEditReservation,
    handleDeleteReservation, handleRequestDeletion,
    handleCreateAlert,
    handleToggleStatus, handleOpenSettings,
    handleReservationSubmit,
    isInefficient,
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
    alerts, reports
  } = useGestionState();


  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Gestion des Objets Connectés</AdminTitle>
        <AdminSubtitle>Gestion des objets, des réservations de salles et des alertes</AdminSubtitle>
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
          <StatValue>{reports.energyConsumption.reduce((total, item) => total + item.value, 0)}</StatValue>
          <StatLabel>Consommation Énergétique</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Catégories */}
      <TabsContainer>
        <TabsList>
          {Object.keys(categories).map(categoryKey => (
            <Tab key={categoryKey} onClick={() => handleCategoryChange(categoryKey)}>
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
            <Card key={object.id}>
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
                <SecondaryButton onClick={() => handleCreateAlert(object)}>Créer une alerte</SecondaryButton>
                <PrimaryButton onClick={() => handleRequestDeletion(object)}>
                  <FaTrash /> Demander la suppression
                </PrimaryButton>
                <SecondaryButton onClick={() => handleOpenSettings(object)}>
                  Configurer
                </SecondaryButton>
                <SecondaryButton onClick={() => setSelectedForChart(object)}>
                  Voir l’historique
                </SecondaryButton>
                <SecondaryButton onClick={() => handleEditObject(object)}>
                  Modifier
                </SecondaryButton>
                <SecondaryButton onClick={() => handleToggleStatus(object)}>
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
                    <PrimaryButton onClick={() => handleDeleteReservation(reservation.id)}>Supprimer</PrimaryButton>
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
              <ExportButton onClick={() => handleExportReport('energyConsumption')}>
                <FaDownload /> Exporter conso
              </ExportButton>
              <ExportButton onClick={() => handleExportReport('objectUsage')}>
                <FaDownload /> Exporter objets inefficaces
              </ExportButton>
            </ButtonGroup>
          </div>
        </SectionHeader>

        <StatsGrid>
          <StatCard>
            <StatValue>
              {reports.energyConsumption.reduce((sum, e) => sum + e.value, 0)} kWh
            </StatValue>
            <StatLabel>Consommation Totale</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{inactiveCount}</StatValue>
            <StatLabel>Objets Inactifs</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle style={{ marginTop: '2rem' }}>Graphique de consommation</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reports.energyConsumption}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Modal de création d'objet */}
      {showObjectModal && (
        <ModalOverlay onClick={() => setShowObjectModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Ajouter un objet connecté</SectionTitle>
            <form onSubmit={handleObjectSubmit}>
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
                    const selectedCategory = e.target.value;
                    const validTypes = categoryToTypeMap[selectedCategory] || [];
                    setObjectFormData({
                      ...objectFormData,
                      category: selectedCategory,
                      type: validTypes[0] || '',
                    });
                  }}
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
                  {objects.filter(obj => obj.type === 'Salle').map((object) => (
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
            {editingSettingsFor.type === 'Chauffage' && (
              <FormGroup>
                <Label>Température cible (°C)</Label>
                <Input
                  type="number"
                  value={objectSettings.temperature}
                  onChange={(e) =>
                    setObjectSettings((prev) => ({ ...prev, temperature: e.target.value }))
                  }
                  placeholder="Ex : 22"
                />
              </FormGroup>
            )}
            {editingSettingsFor.type === 'Éclairage' && (
              <>
                <FormGroup>
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    value={objectSettings.startTime}
                    onChange={(e) =>
                      setObjectSettings((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    value={objectSettings.endTime}
                    onChange={(e) =>
                      setObjectSettings((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                  />
                </FormGroup>
              </>
            )}
            <ButtonGroup>
              <SecondaryButton onClick={() => setEditingSettingsFor(null)}>Annuler</SecondaryButton>
              <PrimaryButton onClick={() => {
                const updatedObjects = objects.map(obj =>
                  obj.id === editingSettingsFor.id
                    ? { ...obj, settings: { ...objectSettings } }
                    : obj
                );
                setObjects(updatedObjects);
                generateReports(updatedObjects); // Mets à jour les rapports ici aussi
                setEditingSettingsFor(null);
              }}>
                Enregistrer
              </PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {selectedForChart && (
        <ModalOverlay onClick={() => setSelectedForChart(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <SectionTitle>Consommation de {selectedForChart.name}</SectionTitle>
            {objectHistories[selectedForChart.id]?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={objectHistories[selectedForChart.id]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune donnée disponible pour cet objet.</p>
            )}
            <ButtonGroup>
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