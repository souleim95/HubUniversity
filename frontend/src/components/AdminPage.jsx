import React, { useState, useEffect } from 'react';
import {
  AdminContainer,
  AdminHeader,
  AdminTitle,
  AdminSubtitle,
  Section,
  SectionHeader,
  SectionTitle,
  ActionButton,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
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
  AlertBanner,
  TabsContainer,
  TabsList,
  Tab,
  ExportButton
} from '../styles/AdminStyles.js';
import { FaUsers, FaTools, FaShieldAlt, FaPalette, FaChartBar, FaPlus, FaEdit, FaTrash, FaDownload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
// Importer les données depuis fakeData.js
import { fakeObjects, categories, equipments } from '../data/fakeData';

function AdminPage() {
    // --------- Gestion des états (states) ---------
    
    // États pour la gestion des utilisateurs
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        login: '',
        role: 'student',
        points: 0,
        password: ''
    });

    // États pour la gestion des objets connectés
    const [objects, setObjects] = useState([]); // Sera rempli avec fakeObjects
    const [categoryList, setCategoryList] = useState([]); // Liste des catégories
    const [showObjectModal, setShowObjectModal] = useState(false);
    const [objectFormData, setObjectFormData] = useState({
        name: '',
        type: '',
        status: 'Actif',
        priority: 'normal'
    });

    // États pour les rapports et statistiques
    const [reports, setReports] = useState({
        energyConsumption: [],
        userActivity: [],
        serviceUsage: []
    });
    const [selectedReport, setSelectedReport] = useState(null);

    // États pour les paramètres de la plateforme
    const [platformSettings, setPlatformSettings] = useState({
        theme: 'light',
        validationRules: {
            requireApproval: true,
            minPasswordLength: 8
        }
    });

    // Navigation par onglets et gestion des alertes
    const [activeTab, setActiveTab] = useState('users');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [selectedAlert, setSelectedAlert] = useState(null);

    // --------- Chargement initial des données ---------
    
    // Charge les données au démarrage du composant
    useEffect(() => {
        fetchUsers();
        fetchObjects();
        fetchReports();
    }, []);

    // Récupère la liste des utilisateurs depuis l'API
    // À remplacer par une vraie implémentation d'API plus tard
    const fetchUsers = async () => {
        setLoadingUsers(true);
        // Simulation d'appel API avec délai artificiel
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUsers = [
            { id: 1, login: 'user1', role: 'student', points: 100, lastLogin: '2024-07-26' },
            { id: 2, login: 'gest1', role: 'gestionnaire', points: 50, lastLogin: '2024-07-25' },
            { id: 3, login: 'admin1', role: 'admin', points: 1000, lastLogin: '2024-07-26' },
        ];
        setUsers(mockUsers);
        setLoadingUsers(false);
    };

    // Récupère la liste des objets et catégories depuis fakeData.js
    const fetchObjects = async () => {
        // Utiliser les données de fakeData
        setObjects(fakeObjects);
        
        // Extraire les types uniques des objets
        const uniqueTypes = [...new Set(fakeObjects.map(obj => obj.type))];
        setCategoryList(uniqueTypes);
    };

    // Récupère les données pour les rapports
    const fetchReports = async () => {
        // Générer des rapports basés sur les données réelles
        
        // Consommation énergétique: simuler basé sur le nombre d'objets actifs
        const activeObjects = fakeObjects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé');
        const energyData = [
            { date: new Date().toISOString().split('T')[0], value: activeObjects.length * 50 }, // 50 unités par objet actif
            { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], value: activeObjects.length * 45 }
        ];
        
        // Activité utilisateurs: simuler basée sur le nombre d'objets et de salles
        const rooms = fakeObjects.filter(obj => obj.type === 'Salle');
        const userActivityData = [
            { date: new Date().toISOString().split('T')[0], activeUsers: Math.min(users.length * 10, rooms.reduce((sum, room) => sum + (room.capacity || 20), 0)) },
            { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], activeUsers: Math.min(users.length * 8, rooms.reduce((sum, room) => sum + (room.capacity || 20), 0)) }
        ];
        
        // Usage des services: basé sur le nombre d'équipements par salle
        const equipmentCountByRoom = Object.keys(equipments).map(roomId => {
            const room = fakeObjects.find(obj => obj.id === roomId);
            return {
                service: room ? room.name : roomId,
                usage: equipments[roomId].length
            };
        });
        
        setReports({
            energyConsumption: energyData,
            userActivity: userActivityData,
            serviceUsage: equipmentCountByRoom
        });
    };

    // --------- Gestion des utilisateurs ---------

    // Ouvre la modal pour ajouter un utilisateur
    const handleAddUser = () => {
        setSelectedUser(null);
        setUserFormData({
            login: '',
            role: 'student',
            points: 0,
            password: ''
        });
        setShowUserModal(true);
    };

    // Ouvre la modal pour modifier un utilisateur existant
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUserFormData({
            login: user.login,
            role: user.role,
            points: user.points,
            password: ''
        });
        setShowUserModal(true);
    };

    // Supprime un utilisateur après confirmation
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            // Dans une vraie app, on appellerait l'API ici
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    // Sauvegarde les modifications d'un utilisateur
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        
        // Met à jour ou crée un utilisateur selon le contexte
        if (selectedUser) {
            setUsers(users.map(user => 
                user.id === selectedUser.id ? { ...user, ...userFormData } : user
            ));
        } else {
            setUsers([...users, { id: Date.now(), ...userFormData }]);
        }
        setShowUserModal(false);
    };

    // --------- Gestion des objets connectés ---------

    // Ouvre la modal pour ajouter un nouvel objet
    const handleAddObject = () => {
        setObjectFormData({
            name: '',
            type: categoryList[0] || 'Salle',
            status: 'Actif',
            priority: 'normal'
        });
        setShowObjectModal(true);
    };

    // Ouvre la modal pour modifier un objet existant
    const handleEditObject = (object) => {
        setSelectedObject(object);
        setObjectFormData({
            name: object.name,
            type: object.type,
            status: object.status,
            priority: object.priority || 'normal'
        });
        setShowObjectModal(true);
    };

    // Supprime un objet après confirmation
    const handleDeleteObject = (objectId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
            setObjects(objects.filter(obj => obj.id !== objectId));
        }
    };

    // Enregistre un nouvel objet ou modifie un objet existant
    const handleObjectSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedObject) {
            // Modification d'un objet existant
            setObjects(objects.map(obj => 
                obj.id === selectedObject.id ? { ...obj, ...objectFormData } : obj
            ));
        } else {
            // Ajout d'un nouvel objet
            const newObject = {
                id: `obj_${Date.now()}`,
                ...objectFormData
            };
            setObjects([...objects, newObject]);
        }
        
        setShowObjectModal(false);
        setSelectedObject(null);
    };

    // --------- Gestion des rapports ---------

    // Exporte les données d'un rapport en CSV
    const handleExportReport = (type) => {
        const data = reports[type];
        const csv = convertToCSV(data);
        downloadCSV(csv, `${type}_report.csv`);
    };

    // Convertit un tableau d'objets en format CSV
    const convertToCSV = (data) => {
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers.map(header => item[header]));
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    };

    // Déclenche le téléchargement du fichier CSV généré
    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Ouvre la modal pour gérer une alerte
    const handleAlertAction = (alert) => {
        setSelectedAlert(alert);
        setShowAlertModal(true);
    };

    // --------- Rendu de l'interface ---------
    return (
        <AdminContainer>
            {/* En-tête de la page d'administration */}
            <AdminHeader>
                <AdminTitle>Administration HubUniversity</AdminTitle>
                <AdminSubtitle>
                    Gestion complète de la plateforme, des utilisateurs et des objets connectés
                </AdminSubtitle>
            </AdminHeader>

            {/* Statistiques globales en haut de la page */}
            <StatsGrid>
                <StatCard>
                    <StatValue>{users.length}</StatValue>
                    <StatLabel>Utilisateurs Total</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{objects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé').length}</StatValue>
                    <StatLabel>Objets Actifs</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{reports.energyConsumption.reduce((total, item) => total + item.value, 0)}</StatValue>
                    <StatLabel>Consommation Totale</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{Object.keys(equipments).reduce((sum, roomId) => sum + equipments[roomId].length, 0)}</StatValue>
                    <StatLabel>Équipements Totaux</StatLabel>
                </StatCard>
            </StatsGrid>

            {/* Navigation par onglets */}
            <TabsContainer>
                <TabsList>
                    <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                        <FaUsers /> Utilisateurs
                    </Tab>
                    <Tab active={activeTab === 'objects'} onClick={() => setActiveTab('objects')}>
                        <FaTools /> Objets
                    </Tab>
                    <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
                        <FaShieldAlt /> Sécurité
                    </Tab>
                    <Tab active={activeTab === 'customization'} onClick={() => setActiveTab('customization')}>
                        <FaPalette /> Personnalisation
                    </Tab>
                    <Tab active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
                        <FaChartBar /> Rapports
                    </Tab>
                </TabsList>
            </TabsContainer>

            {/* Contenu de l'onglet Utilisateurs */}
            {activeTab === 'users' && (
                <Section>
                    <SectionHeader>
                        <SectionTitle><FaUsers /> Gestion des Utilisateurs</SectionTitle>
                        <ActionButton onClick={handleAddUser}>
                            <FaPlus /> Ajouter un utilisateur
                        </ActionButton>
                    </SectionHeader>
                    
                    {/* Affichage conditionnel pendant le chargement */}
                    {loadingUsers ? (
                        <p>Chargement des utilisateurs...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>Login</TableHeaderCell>
                                    <TableHeaderCell>Rôle</TableHeaderCell>
                                    <TableHeaderCell>Points</TableHeaderCell>
                                    <TableHeaderCell>Dernière Connexion</TableHeaderCell>
                                    <TableHeaderCell>Actions</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.login}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={user.role}>
                                                {user.role}
                                            </StatusBadge>
                                        </TableCell>
                                        <TableCell>{user.points}</TableCell>
                                        <TableCell>{user.lastLogin}</TableCell>
                                        <TableCell>
                                            <ButtonGroup>
                                                <SecondaryButton onClick={() => handleEditUser(user)}>
                                                    Modifier
                                                </SecondaryButton>
                                                <PrimaryButton onClick={() => handleDeleteUser(user.id)}>
                                                    Supprimer
                                                </PrimaryButton>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Section>
            )}

            {/* Contenu de l'onglet Objets */}
            {activeTab === 'objects' && (
                <Section>
                    <SectionHeader>
                        <SectionTitle><FaTools /> Gestion des Objets</SectionTitle>
                        <ActionButton onClick={handleAddObject}>
                            <FaPlus /> Ajouter un objet
                        </ActionButton>
                    </SectionHeader>
                    
                    {/* Vue d'ensemble - Stats rapides */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <Card style={{ flex: '1', minWidth: '200px', textAlign: 'center', padding: '15px' }}>
                            <StatValue>{objects.filter(obj => obj.type === 'Salle').length}</StatValue>
                            <StatLabel>Salles</StatLabel>
                        </Card>
                        <Card style={{ flex: '1', minWidth: '200px', textAlign: 'center', padding: '15px' }}>
                            <StatValue>{objects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé').length}</StatValue>
                            <StatLabel>Objets Actifs</StatLabel>
                        </Card>
                        <Card style={{ flex: '1', minWidth: '200px', textAlign: 'center', padding: '15px' }}>
                            <StatValue>{objects.filter(obj => obj.status === 'Maintenance').length}</StatValue>
                            <StatLabel>En Maintenance</StatLabel>
                        </Card>
                        <Card style={{ flex: '1', minWidth: '200px', textAlign: 'center', padding: '15px' }}>
                            <StatValue>{Object.values(equipments).flat().length}</StatValue>
                            <StatLabel>Équipements</StatLabel>
                        </Card>
                    </div>
                    
                    {/* Affichage par catégories */}
                    <Grid style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {/* Liste des types d'objets */}
                        <Card style={{ gridColumn: '1 / span 1' }}>
                            <CardTitle>Types d'Objets</CardTitle>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {categoryList.map((category, index) => (
                                    <li key={index} style={{ 
                                        padding: '10px 15px', 
                                        borderBottom: '1px solid #eee',
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                                        borderRadius: '4px',
                                        margin: '2px 0'
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{category}</span>
                                        <span style={{ 
                                            backgroundColor: '#e0e0e0', 
                                            padding: '2px 8px', 
                                            borderRadius: '12px', 
                                            fontSize: '0.8rem',
                                            minWidth: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {objects.filter(obj => obj.type === category).length}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        
                        {/* Liste des objets avec statut */}
                        <Card style={{ gridColumn: 'span 3' }}>
                            <CardTitle>Objets par Statut</CardTitle>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#4CAF50', 
                                    color: 'white', 
                                    borderRadius: '4px', 
                                    fontSize: '0.9em',
                                    flex: '1',
                                    minWidth: '120px',
                                    textAlign: 'center'
                                }}>
                                    Actifs: {objects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé' || obj.status === 'Disponible').length}
                                </div>
                                <div style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#FFC107', 
                                    color: 'white', 
                                    borderRadius: '4px', 
                                    fontSize: '0.9em',
                                    flex: '1',
                                    minWidth: '120px',
                                    textAlign: 'center'
                                }}>
                                    Occupés: {objects.filter(obj => obj.status === 'Occupée').length}
                                </div>
                                <div style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#F44336', 
                                    color: 'white', 
                                    borderRadius: '4px', 
                                    fontSize: '0.9em',
                                    flex: '1',
                                    minWidth: '120px',
                                    textAlign: 'center'
                                }}>
                                    Inactifs: {objects.filter(obj => obj.status === 'Inactif' || obj.status === 'Éteint').length}
                                </div>
                            </div>
                            
                            <div style={{ maxHeight: '460px', overflowY: 'auto', borderRadius: '4px', border: '1px solid #eee' }}>
                                <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <TableHeader>
                                        <tr>
                                            <TableHeaderCell>Nom</TableHeaderCell>
                                            <TableHeaderCell>Type</TableHeaderCell>
                                            <TableHeaderCell>Statut</TableHeaderCell>
                                            <TableHeaderCell>Actions</TableHeaderCell>
                                        </tr>
                                    </TableHeader>
                                    <tbody>
                                {objects.map((object) => (
                                            <TableRow key={object.id}>
                                                <TableCell>{object.name}</TableCell>
                                                <TableCell>{object.type}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={
                                                        object.status === 'Actif' || object.status === 'Allumé' || object.status === 'Disponible' ? 'active' :
                                                        object.status === 'Inactif' || object.status === 'Éteint' ? 'inactive' :
                                                        'maintenance'
                                                    }>
                                                {object.status}
                                            </StatusBadge>
                                                </TableCell>
                                                <TableCell>
                                        <ButtonGroup>
                                                        <SecondaryButton onClick={() => handleEditObject(object)}>
                                                            <FaEdit style={{ marginRight: '5px' }} /> Modifier
                                                        </SecondaryButton>
                                                        <PrimaryButton onClick={() => handleDeleteObject(object.id)}>
                                                            <FaTrash style={{ marginRight: '5px' }} /> Supprimer
                                                        </PrimaryButton>
                                        </ButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Grid>
                    
                    {/* Tableau des équipements par salle */}
                    <SectionTitle style={{ marginTop: '30px', marginBottom: '15px' }}>
                        Équipements par Salle
                    </SectionTitle>
                    <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>Salle</TableHeaderCell>
                                    <TableHeaderCell>Nombre d'équipements</TableHeaderCell>
                                    <TableHeaderCell>Statut Salle</TableHeaderCell>
                                    <TableHeaderCell>Actions</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {Object.keys(equipments).map(roomId => {
                                    const room = fakeObjects.find(obj => obj.id === roomId);
                                    if (!room) return null;
                                    
                                    return (
                                        <TableRow key={roomId} style={{ cursor: 'pointer' }} onClick={() => {
                                            // Ici on pourrait implémenter un affichage détaillé des équipements
                                            console.log(`Equipements de ${room.name}:`, equipments[roomId]);
                                        }}>
                                            <TableCell style={{ fontWeight: 'bold' }}>{room.name}</TableCell>
                                            <TableCell>{equipments[roomId].length}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={
                                                    room.status === 'Disponible' ? 'active' :
                                                    room.status === 'Occupée' ? 'inactive' : 'maintenance'
                                                }>
                                                    {room.status}
                                                </StatusBadge>
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup>
                                                    <SecondaryButton onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditObject(room);
                                                    }}>
                                                        <FaEdit style={{ marginRight: '5px' }} /> Gérer
                                                    </SecondaryButton>
                                                    <PrimaryButton onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Ici on pourrait implémenter un modal pour voir les équipements
                                                        alert(`${room.name} contient ${equipments[roomId].length} équipements`);
                                                    }}>
                                                        Détails
                                                    </PrimaryButton>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Section>
            )}

            {/* Contenu de l'onglet Sécurité */}
            {activeTab === 'security' && (
                <Section>
                    <SectionHeader>
                        <SectionTitle><FaShieldAlt /> Sécurité et Maintenance</SectionTitle>
                    </SectionHeader>
                    <Grid>
                        <Card>
                            <CardTitle>Mise à jour du système</CardTitle>
                            <ActionButton>Vérifier les mises à jour</ActionButton>
                        </Card>
                        <Card>
                            <CardTitle>Sauvegarde</CardTitle>
                            <ActionButton>Effectuer une sauvegarde</ActionButton>
                        </Card>
                        <Card>
                            <CardTitle>Vérification d'intégrité</CardTitle>
                            <ActionButton>Lancer la vérification</ActionButton>
                        </Card>
                    </Grid>

                    {/* Liste des alertes de sécurité en cours */}
                    <SectionTitle style={{ marginTop: '2rem' }}>Alertes de Sécurité</SectionTitle>
                    
                    {/* Afficher les vrais objets qui nécessitent attention */}
                    {fakeObjects
                        .filter(obj => 
                            obj.status === 'Maintenance' || 
                            obj.status === 'Alarme Incendie' || 
                            obj.status === 'Fumée détectée' ||
                            obj.status === 'Alarme'
                        )
                        .map(alert => (
                            <AlertBanner key={alert.id} type="warning">
                            <FaExclamationTriangle />
                            <div>
                                    <strong>{alert.name}: {alert.status}</strong>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Attention requise</div>
                            </div>
                            <ActionButton onClick={() => handleAlertAction(alert)}>
                                Résoudre
                            </ActionButton>
                        </AlertBanner>
                        ))
                    }
                    
                    {/* Si aucune alerte, afficher un message positif */}
                    {fakeObjects.filter(obj => 
                        obj.status === 'Maintenance' || 
                        obj.status === 'Alarme Incendie' || 
                        obj.status === 'Fumée détectée' ||
                        obj.status === 'Alarme'
                    ).length === 0 && (
                        <AlertBanner type="success">
                            <FaCheck />
                            <div>
                                <strong>Aucune alerte active</strong>
                                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Tous les systèmes fonctionnent normalement</div>
                            </div>
                        </AlertBanner>
                    )}
                </Section>
            )}

            {/* Contenu de l'onglet Personnalisation */}
            {activeTab === 'customization' && (
                <Section>
                    <SectionHeader>
                        <SectionTitle><FaPalette /> Personnalisation de la Plateforme</SectionTitle>
                    </SectionHeader>
                    <Grid>
                        <Card>
                            <CardTitle>Apparence</CardTitle>
                            <FormGroup>
                                <Label>Thème</Label>
                                <Select
                                    value={platformSettings.theme}
                                    onChange={(e) => setPlatformSettings({...platformSettings, theme: e.target.value})}
                                >
                                    <option value="light">Clair</option>
                                    <option value="dark">Sombre</option>
                                </Select>
                            </FormGroup>
                        </Card>
                        <Card>
                            <CardTitle>Validation des Inscriptions</CardTitle>
                            <FormGroup>
                                <Label>Mode de validation</Label>
                                <Select>
                                    <option>Automatique</option>
                                    <option>Manuel</option>
                                    <option>Hybride</option>
                                </Select>
                            </FormGroup>
                        </Card>
                    </Grid>
                </Section>
            )}

            {/* Contenu de l'onglet Rapports */}
            {activeTab === 'reports' && (
                <Section>
                    <SectionHeader>
                        <SectionTitle><FaChartBar /> Rapports Avancés</SectionTitle>
                        <ButtonGroup>
                            <ExportButton onClick={() => handleExportReport('energyConsumption')}>
                                <FaDownload /> Exporter Consommation
                            </ExportButton>
                            <ExportButton onClick={() => handleExportReport('userActivity')}>
                                <FaDownload /> Exporter Activité
                            </ExportButton>
                            <ExportButton onClick={() => handleExportReport('serviceUsage')}>
                                <FaDownload /> Exporter Usage
                            </ExportButton>
                        </ButtonGroup>
                    </SectionHeader>

                    {/* Affichage des métriques clés amélioré */}
                    <Grid style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <Card style={{ padding: '20px', textAlign: 'center' }}>
                            <CardTitle>Consommation Énergétique</CardTitle>
                            <StatValue style={{ color: '#4CAF50', fontSize: '2.5rem' }}>
                                {reports.energyConsumption.reduce((total, item) => total + item.value, 0)}
                            </StatValue>
                            <StatLabel>Total kWh sur 30 jours</StatLabel>
                            <div style={{ marginTop: '15px', height: '80px', backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                                {reports.energyConsumption.map((item, index) => (
                                    <div key={index} style={{ height: `${(item.value / 2000) * 100}%`, width: '30px', backgroundColor: '#4CAF50', borderRadius: '4px', position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        
                        <Card style={{ padding: '20px', textAlign: 'center' }}>
                            <CardTitle>Activité Utilisateurs</CardTitle>
                            <StatValue style={{ color: '#2196F3', fontSize: '2.5rem' }}>
                                {reports.userActivity.length > 0 
                                    ? Math.round(reports.userActivity.reduce((total, item) => total + item.activeUsers, 0) / reports.userActivity.length)
                                    : 0}
                            </StatValue>
                            <StatLabel>Moyenne utilisateurs quotidiens</StatLabel>
                            <div style={{ marginTop: '15px', height: '80px', backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                                {reports.userActivity.map((item, index) => (
                                    <div key={index} style={{ height: `${(item.activeUsers / 200) * 100}%`, width: '30px', backgroundColor: '#2196F3', borderRadius: '4px', position: 'relative' }}>
                                        <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        
                        <Card style={{ padding: '20px', textAlign: 'center' }}>
                            <CardTitle>Taux d'Occupation</CardTitle>
                            <StatValue style={{ color: '#FF9800', fontSize: '2.5rem' }}>
                                {fakeObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length} / {fakeObjects.filter(obj => obj.type === 'Salle').length}
                            </StatValue>
                            <StatLabel>Salles occupées</StatLabel>
                            <div style={{ 
                                marginTop: '15px', 
                                height: '80px', 
                                backgroundColor: '#f5f5f5', 
                                borderRadius: '4px', 
                                padding: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: '30px', 
                                    backgroundColor: '#eee', 
                                    borderRadius: '15px', 
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{ 
                                        width: `${(fakeObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length / fakeObjects.filter(obj => obj.type === 'Salle').length) * 100}%`, 
                                        height: '100%', 
                                        backgroundColor: '#FF9800', 
                                        borderRadius: '15px 0 0 15px'
                                    }}></div>
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)', 
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        {Math.round((fakeObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length / fakeObjects.filter(obj => obj.type === 'Salle').length) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </Card>
                        
                        <Card style={{ padding: '20px', textAlign: 'center' }}>
                            <CardTitle>Équipements Actifs</CardTitle>
                            <StatValue style={{ color: '#9C27B0', fontSize: '2.5rem' }}>
                                {Object.values(equipments).flat().filter(eq => eq.status === 'Actif' || eq.status === 'Allumé').length} / {Object.values(equipments).flat().length}
                            </StatValue>
                            <StatLabel>Taux d'activité</StatLabel>
                            <div style={{ 
                                marginTop: '15px', 
                                height: '80px', 
                                backgroundColor: '#f5f5f5', 
                                borderRadius: '4px', 
                                padding: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: '30px', 
                                    backgroundColor: '#eee', 
                                    borderRadius: '15px', 
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{ 
                                        width: `${(Object.values(equipments).flat().filter(eq => eq.status === 'Actif' || eq.status === 'Allumé').length / Object.values(equipments).flat().length) * 100}%`, 
                                        height: '100%', 
                                        backgroundColor: '#9C27B0', 
                                        borderRadius: '15px 0 0 15px'
                                    }}></div>
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)', 
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold', 
                                        color: '#333'
                                    }}>
                                        {Math.round((Object.values(equipments).flat().filter(eq => eq.status === 'Actif' || eq.status === 'Allumé').length / Object.values(equipments).flat().length) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                    
                    {/* Tableau des services les plus utilisés */}
                    <SectionTitle style={{ marginBottom: '15px' }}>Services les Plus Utilisés</SectionTitle>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', marginBottom: '30px' }}>
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHeaderCell>Service</TableHeaderCell>
                                    <TableHeaderCell>Utilisation</TableHeaderCell>
                                    <TableHeaderCell>Pourcentage</TableHeaderCell>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {reports.serviceUsage.sort((a, b) => b.usage - a.usage).map((service, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{service.service}</TableCell>
                                        <TableCell>{service.usage}</TableCell>
                                        <TableCell>
                                            <div style={{ width: '100%', height: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                                <div style={{ 
                                                    width: `${(service.usage / reports.serviceUsage.reduce((max, s) => Math.max(max, s.usage), 0)) * 100}%`, 
                                                    height: '100%', 
                                                    backgroundColor: index === 0 ? '#4CAF50' : (index === 1 ? '#2196F3' : '#FF9800'), 
                                                    borderRadius: '10px'
                                                }}></div>
                                                <span style={{ position: 'absolute', top: '50%', left: '5px', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#333' }}>
                                                    {Math.round((service.usage / reports.serviceUsage.reduce((sum, s) => sum + s.usage, 0)) * 100)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Section>
            )}

            {/* Modal pour la gestion des utilisateurs */}
            {showUserModal && (
                <ModalOverlay onClick={() => setShowUserModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <SectionTitle>{selectedUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</SectionTitle>
                        <form onSubmit={handleUserSubmit}>
                            <FormGroup>
                                <Label>Login</Label>
                                <Input
                                    type="text"
                                    value={userFormData.login}
                                    onChange={(e) => setUserFormData({...userFormData, login: e.target.value})}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Rôle</Label>
                                <Select
                                    value={userFormData.role}
                                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                                >
                                    <option value="student">Étudiant</option>
                                    <option value="gestionnaire">Gestionnaire</option>
                                    <option value="admin">Administrateur</option>
                                </Select>
                            </FormGroup>
                            <FormGroup>
                                <Label>Points</Label>
                                <Input
                                    type="number"
                                    value={userFormData.points}
                                    onChange={(e) => setUserFormData({...userFormData, points: parseInt(e.target.value)})}
                                />
                            </FormGroup>
                            {/* Le champ mot de passe n'est affiché que lors de la création */}
                            {!selectedUser && (
                                <FormGroup>
                                    <Label>Mot de passe</Label>
                                    <Input
                                        type="password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                                        required
                                    />
                                </FormGroup>
                            )}
                            <ButtonGroup>
                                <SecondaryButton type="button" onClick={() => setShowUserModal(false)}>
                                    Annuler
                                </SecondaryButton>
                                <PrimaryButton type="submit">
                                    {selectedUser ? 'Modifier' : 'Ajouter'}
                                </PrimaryButton>
                            </ButtonGroup>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Modal pour la gestion des objets */}
            {showObjectModal && (
                <ModalOverlay onClick={() => setShowObjectModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <SectionTitle>{selectedObject ? "Modifier l'objet" : "Ajouter un objet"}</SectionTitle>
                        <form onSubmit={handleObjectSubmit}>
                            <FormGroup>
                                <Label>Nom</Label>
                                <Input
                                    type="text"
                                    value={objectFormData.name}
                                    onChange={(e) => setObjectFormData({...objectFormData, name: e.target.value})}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Type</Label>
                                <Select
                                    value={objectFormData.type}
                                    onChange={(e) => setObjectFormData({...objectFormData, type: e.target.value})}
                                >
                                    {categoryList.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </Select>
                            </FormGroup>
                            <FormGroup>
                                <Label>Statut</Label>
                                <Select
                                    value={objectFormData.status}
                                    onChange={(e) => setObjectFormData({...objectFormData, status: e.target.value})}
                                >
                                    <option value="Actif">Actif</option>
                                    <option value="Inactif">Inactif</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Occupée">Occupée</option>
                                    <option value="Maintenance">Maintenance</option>
                                </Select>
                            </FormGroup>
                            <FormGroup>
                                <Label>Priorité</Label>
                                <Select
                                    value={objectFormData.priority}
                                    onChange={(e) => setObjectFormData({...objectFormData, priority: e.target.value})}
                                >
                                    <option value="low">Basse</option>
                                    <option value="normal">Normale</option>
                                    <option value="high">Haute</option>
                                </Select>
                            </FormGroup>
                            <ButtonGroup>
                                <SecondaryButton type="button" onClick={() => setShowObjectModal(false)}>
                                    Annuler
                                </SecondaryButton>
                                <PrimaryButton type="submit">
                                    {selectedObject ? 'Modifier' : 'Ajouter'}
                                </PrimaryButton>
                            </ButtonGroup>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Modal de résolution des alertes */}
            {showAlertModal && (
                <ModalOverlay onClick={() => setShowAlertModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <SectionTitle>Résoudre l'alerte</SectionTitle>
                        <AlertBanner type="warning">
                            <FaExclamationTriangle />
                            <div>
                                <strong>{selectedAlert?.name} - {selectedAlert?.status}</strong>
                                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    Type: {selectedAlert?.type}
                                </div>
                            </div>
                        </AlertBanner>
                        <FormGroup>
                            <Label>Action corrective</Label>
                            <Input type="text" placeholder="Décrivez l'action effectuée..." />
                        </FormGroup>
                        <FormGroup>
                            <Label>Nouveau statut</Label>
                            <Select>
                                <option value="Actif">Actif</option>
                                <option value="Maintenance">Maintenance requise</option>
                                <option value="Résolu">Problème résolu</option>
                            </Select>
                        </FormGroup>
                        <ButtonGroup>
                            <SecondaryButton onClick={() => setShowAlertModal(false)}>Annuler</SecondaryButton>
                            <PrimaryButton onClick={() => {
                                // Simuler la résolution de l'alerte
                                setObjects(objects.map(obj => 
                                    obj.id === selectedAlert?.id ? { ...obj, status: 'Actif' } : obj
                                ));
                                setShowAlertModal(false);
                            }}>
                                Marquer comme résolu
                            </PrimaryButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AdminContainer>
    );
}

export default AdminPage; 