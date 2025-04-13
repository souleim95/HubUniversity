import React, { useState, useEffect } from 'react';
import { fakeObjects, categories } from '../data/fakeData';
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
  TableRow
} from '../styles/AdminStyles.js';
import { FaTools, FaCalendar, FaExclamationTriangle, FaPlus, FaTrash, FaChartBar } from 'react-icons/fa';

const categoryToTypeMap = {
  salles: ['Salle', 'Thermostat', 'Éclairage', 'Audio', 'Ventilation'],
  ecole: ['Caméra', 'Porte', 'Éclairage', 'Panneau', 'Securite'],
  parking: ['Caméra', 'Capteur', 'Éclairage', 'Panneau', 'Borne']
};



function GestionPage() {
  // --------- États pour la gestion des objets ---------
  const [objects, setObjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [objectHistories, setObjectHistories] = useState({});
  const [selectedForChart, setSelectedForChart] = useState(null);
  const [globalFilterCategory, setGlobalFilterCategory] = useState('all');
  const [globalFilterPeriod, setGlobalFilterPeriod] = useState('jour');
  

  const [objectFormData, setObjectFormData] = useState({
    name: '',
    category: selectedCategory,
    status: 'active',
    priority: 'normal',
    type: categoryToTypeMap[selectedCategory][0],
    numero: '',
    targetTemp: '',             // pour les Thermostats
  brightnessSchedule: '',     // pour Éclairage (horaire fonctionnement)

  });
  const [objectSettings, setObjectSettings] = useState({});
const [editingSettingsFor, setEditingSettingsFor] = useState(null);

  
  

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

  const generateReports = (objectsToAnalyze) => {
    const today = new Date().toISOString().split('T')[0];
  
    const energyData = objectsToAnalyze.map(obj => ({
      id: obj.id,
      date: today,
      value: obj.status === 'active' ? 50 : 20
    }));
  
    const inefficients = objectsToAnalyze.filter(obj => {
      if (obj.type === 'Thermostat') {
        return parseInt(obj.settings?.temperature) > 24;
      }
      if (obj.type === 'Éclairage') {
        const [start, end] = [obj.settings?.startTime, obj.settings?.endTime];
        return start === '00:00' && end === '23:59';
      }
      return false;
    });
  
    // Mise à jour des historiques individuels
    setObjectHistories(prev => {
      const updated = { ...prev };
      energyData.forEach(({ id, date, value }) => {
        if (!updated[id]) updated[id] = [];
        updated[id].push({ date, value });
      });
      return updated;
    });
  
    setReports({
      energyConsumption: energyData,
      objectUsage: inefficients
    });
  
    const inactifs = objectsToAnalyze.filter(obj => obj.status === 'inactive');
    setInactiveCount(inactifs.length);
  };
  
  const getFilteredEnergyData = () => {
    const allData = reports.energyConsumption;
  
    const grouped = allData.reduce((acc, entry) => {
      const cat = fakeObjects.find(obj => obj.id === entry.id)?.category || 'autres';
      const key = globalFilterCategory === 'all' || cat === globalFilterCategory;
      const date = entry.date;
  
      if (key) {
        if (!acc[date]) acc[date] = 0;
        acc[date] += entry.value;
      }
  
      return acc;
    }, {});
  
    return Object.entries(grouped).map(([date, total]) => ({ date, total }));
  };
  
  
  
  useEffect(() => {
    const filteredObjects = fakeObjects
      .filter(obj => !['grille_ecole', 'cam_urgence', 'detecteur_fumee', 'acces_parking', 'eclairage_parking', 'borne_recharge', 'detecteur_parking','capteur789'].includes(obj.id))
      .map(obj => ({
        ...obj,
        settings: obj.settings || {
          temperature: obj.targetTemp || null,
          startTime: obj.schedule?.split('-')[0] || '',
          endTime: obj.schedule?.split('-')[1] || ''
        }
      }));
  
    const categoryObjects = filteredObjects.filter(object =>
      categories[selectedCategory]?.items.includes(object.id)
    );
  
    setObjects(categoryObjects);
    generateReports(categoryObjects); // <-- c'est CET appel qu'il faut garder
  }, [selectedCategory]);
  
  

  // --------- Gestion des objets ---------
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };


  
  
  

  const handleAddObject = () => {
    setObjectFormData({ name: '', category: selectedCategory, status: 'active', priority: 'normal' });
    setShowObjectModal(true);
  };

  const prefixMap = {
    salles: 'salle',
    ecole: 'ecole',
    parking: 'parking'
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

  const handleObjectSubmit = (e) => {
    e.preventDefault();
  
    const prefixMap = {
      salles: 'salle',
      ecole: 'ecole',
      parking: 'parking'
    };
  
    const prefix = prefixMap[objectFormData.category] || 'obj';
    const fullId = `${prefix}${objectFormData.numero}`;
  
    const idExists =
      fakeObjects.some((obj) => obj.id === fullId) ||
      objects.some((obj) => obj.id === fullId);
  
    if (idExists) {
      alert("Cet identifiant existe déjà ! Choisissez un autre numéro.");
      return;
    }
  
    const newObject = {
      id: fullId,
      name: objectFormData.name,
      type: objectFormData.type,
      status: objectFormData.status,
      location: fullId,
      ...(objectFormData.type === 'Thermostat' && {
        targetTemp: parseInt(objectFormData.targetTemp) || 0
      }),
      ...(objectFormData.type === 'Éclairage' && {
        schedule: objectFormData.brightnessSchedule || ''
      }),
      settings: {
        temperature: objectFormData.targetTemp || null,
        startTime: objectFormData.brightnessSchedule?.split('-')[0] || '',
        endTime: objectFormData.brightnessSchedule?.split('-')[1] || ''
      }
    };
  
    const updatedObjects = [...objects, newObject];
    setObjects(updatedObjects);
    generateReports(updatedObjects); // 🟢 Maintenant c’est bon ✅
    setShowObjectModal(false);
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

  const handleOpenSettings = (object) => {
    setEditingSettingsFor(object);
  
    setObjectSettings({
      temperature: object.settings?.temperature || '',
      startTime: object.settings?.startTime || '',
      endTime: object.settings?.endTime || ''
    });
  
    setObjects(prev => {
      const updated = prev.map(obj =>
        obj.id === object.id
          ? { ...obj, settings: { ...objectSettings } }
          : obj
      );
      generateReports(updated);
      return updated;
    });
  };
  
  
  const handleReservationSubmit = (e) => {
    e.preventDefault();
  
    if (reservationFormData.id) {
      // Modification d'une réservation existante
      setReservations(prev =>
        prev.map(res =>
          res.id === reservationFormData.id
            ? { ...res, ...reservationFormData }
            : res
        )
      );
    } else {
      // Nouvelle réservation
      const newReservation = {
        id: Date.now(),
        ...reservationFormData
      };
      setReservations(prev => [...prev, newReservation]);
    }
  
    setShowReservationModal(false);
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
      <p><strong>Zone :</strong> {object.id}</p>
      <br></br>
      <p><strong>Statut :</strong> <StatusBadge status={object.status}>{object.status}</StatusBadge></p>
      
      <ButtonGroup>
        <SecondaryButton onClick={() => handleCreateAlert(object)}>Créer une alerte</SecondaryButton>
        <PrimaryButton onClick={() => handleRequestDeletion(object)}>
          <FaTrash /> Demander la suppression
        </PrimaryButton>
        <SecondaryButton onClick={() => handleOpenSettings(object)}>
  Configurer
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

<Section>
  <SectionHeader>
    <SectionTitle>
      <FaChartBar /> Rapports d'Utilisation & Efficacité
    </SectionTitle>
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

{objectFormData.type === 'Thermostat' && (
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

{editingSettingsFor && (
  <ModalOverlay onClick={() => setEditingSettingsFor(null)}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <SectionTitle>Configurer {editingSettingsFor.name}</SectionTitle>

      {editingSettingsFor.type === 'Thermostat' && (
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


    </AdminContainer>
  );
}
export default GestionPage;
