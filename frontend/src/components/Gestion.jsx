import React, { useState, useEffect } from 'react';
import { fakeObjects, categories } from '../data/fakeData';
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
  TableRow
} from '../styles/AdminStyles.js';
import { FaTools, FaCalendar, FaExclamationTriangle, FaPlus, FaTrash, FaChartBar } from 'react-icons/fa';

function GestionPage() {
  // --------- États pour la gestion des objets ---------
  const [objects, setObjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [objectFormData, setObjectFormData] = useState({
    name: '',
    category: 'Salle',
    status: 'active',
    priority: 'normal'
  });

  // --------- États pour la gestion des réservations ---------
  const [reservations, setReservations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationFormData, setReservationFormData] = useState({
    room: '',
    date: '',
    time: '',
  });

  // --------- États pour la gestion des alertes ---------
  const [alerts, setAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // --------- États pour les rapports ---------
  const [reports, setReports] = useState({
    energyConsumption: [],
    objectUsage: [],
  });


  useEffect(() => {
    // Filtrage des objets pour exclure ceux spécifiés
    const filteredObjects = fakeObjects.filter(object => {
      // Exclure certains objets par leur ID
      return !['grille_ecole', 'cam_urgence', 'detecteur_fumee', 'acces_parking', 'eclairage_parking', 'borne_recharge', 'detecteur_parking','capteur789'].includes(object.id);
    });
  
    // Filtrer selon la catégorie sélectionnée
    const categoryObjects = filteredObjects.filter(object => categories[selectedCategory]?.items.includes(object.id));
  
    // Mettre à jour l'état avec les objets filtrés et triés par catégorie
    setObjects(categoryObjects);
  }, [selectedCategory]); // Exécution à chaque changement de catégorie

  // --------- Gestion des objets ---------
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  

  const handleAddObject = () => {
    setObjectFormData({ name: '', category: selectedCategory, status: 'active', priority: 'normal' });
    setShowObjectModal(true);
  };

  const handleObjectSubmit = (e) => {
    e.preventDefault();
    const newObject = { id: Date.now(), ...objectFormData };
    setObjects(prevObjects => [...prevObjects, newObject]);
    setShowObjectModal(false);
  };

  // --------- Gestion des réservations ---------
  const handleAddReservation = () => {
    setReservationFormData({ room: '', date: '', time: '' });
    setShowReservationModal(true);
  };

  const handleEditReservation = (reservation) => {
    setReservationFormData({
      room: reservation.room,
      date: reservation.date,
      time: reservation.time,
    });
    setShowReservationModal(true);
  };

  const handleDeleteReservation = (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    }
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (reservationFormData.id) {
      setReservations(reservations.map(reservation => 
        reservation.id === reservationFormData.id ? { ...reservation, ...reservationFormData } : reservation
      ));
    } else {
      setReservations([...reservations, { id: Date.now(), ...reservationFormData }]);
    }
    setShowReservationModal(false);
  };

// --------- Gestion des objets ---------
const handleRequestDeletion = (object) => {
  // Créer une alerte pour demander la suppression de l'objet
  if (window.confirm(`Êtes-vous sûr de vouloir demander la suppression de ${object.name} ?`)) {
    // Ici tu peux envoyer un message ou une alerte à l'administrateur, par exemple en ajoutant l'objet à une liste des objets à supprimer
    alert(`La demande de suppression pour l'objet ${object.name} a été envoyée à l'administrateur.`);
    
    // Tu peux également maintenir une liste d'objets à supprimer (à traiter côté serveur ou administrateur)
    setAlerts(prevAlerts => [...prevAlerts, { message: `Demande de suppression pour ${object.name}`, objectId: object.id }]);
  }
};


 



  // --------- Gestion des alertes ---------
  const handleCreateAlert = (object) => {
    // Créer une nouvelle alerte pour l'objet
    const newAlert = {
      id: Date.now(), // Un identifiant unique pour l'alerte
      message: `Problème détecté pour ${object.name}, veuillez contacter un administrateur.`, // Message de l'alerte
      objectId: object.id,
    };
  
    // Ajouter l'alerte à l'état des alertes
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
  
    // Optionnel : afficher une alerte en pop-up
    alert(`L'alerte pour l'objet ${object.name} a été créée.`);
  };

  const handleAlertAction = (alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

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
      <StatusBadge status={object.status}>{object.status}</StatusBadge>
      <ButtonGroup>
        <SecondaryButton onClick={() => handleCreateAlert(object)}>Créer une alerte</SecondaryButton>
        <PrimaryButton onClick={() => handleRequestDeletion(object)}>
          <FaTrash /> Demander la suppression
        </PrimaryButton>
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
          <TableCell>{fakeObjects.find(object => object.id === alert.objectId)?.name}</TableCell>
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
                  onChange={(e) => setObjectFormData({ ...objectFormData, category: e.target.value })}
                >
                  {Object.keys(categories).map(categoryKey => (
                    <option key={categoryKey} value={categoryKey}>{categories[categoryKey].name}</option>
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
              <ButtonGroup>
                <SecondaryButton type="button" onClick={() => setShowObjectModal(false)}>Annuler</SecondaryButton>
                <PrimaryButton type="submit">Ajouter</PrimaryButton>
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
    </AdminContainer>
  );
}

export default GestionPage;
