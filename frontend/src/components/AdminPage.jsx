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
import { FaUsers, FaTools, FaShieldAlt, FaPalette, FaChartBar, FaPlus, FaEdit, FaTrash, FaDownload, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

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
    const [objects, setObjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showObjectModal, setShowObjectModal] = useState(false);
    const [objectFormData, setObjectFormData] = useState({
        name: '',
        category: '',
        status: 'active',
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

    // Récupère la liste des objets et catégories
    const fetchObjects = async () => {
        // Données temporaires pour le développement
        const mockObjects = [
            { id: 1, name: 'Salle 101', category: 'Salle', status: 'active', priority: 'high' },
            { id: 2, name: 'Imprimante A', category: 'Équipement', status: 'maintenance', priority: 'normal' },
            { id: 3, name: 'Chauffage', category: 'Équipement', status: 'inactive', priority: 'high' },
            { id: 4, name: 'Refectoire', category: 'Salle', status: 'inactive', priority: 'high' },
        ];
        setObjects(mockObjects);
        setCategories(['Salle', 'Équipement', 'Service']);
    };

    // Récupère les données pour les rapports
    const fetchReports = async () => {
        // Données factices pour les graphiques et statistiques
        setReports({
            energyConsumption: [
                { date: '2024-07-26', value: 1500 },
                { date: '2024-07-25', value: 1450 }
            ],
            userActivity: [
                { date: '2024-07-26', activeUsers: 120 },
                { date: '2024-07-25', activeUsers: 115 }
            ],
            serviceUsage: [
                { service: 'Imprimante', usage: 50 },
                { service: 'Salle de réunion', usage: 30 }
            ]
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
            category: categories[0],
            status: 'active',
            priority: 'normal'
        });
        setShowObjectModal(true);
    };

    // Enregistre un nouvel objet
    const handleObjectSubmit = async (e) => {
        e.preventDefault();
        // Dans une vraie app, on ferait un appel API ici
        setObjects([...objects, { id: Date.now(), ...objectFormData }]);
        setShowObjectModal(false);
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
                    <StatValue>{objects.length}</StatValue>
                    <StatLabel>Objets Actifs</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{reports.energyConsumption.reduce((total, item) => total + item.value, 0)}</StatValue>
                    <StatLabel>Consommation Totale</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{reports.userActivity.reduce((total, item) => total + item.activeUsers, 0)}</StatValue>
                    <StatLabel>Activité Utilisateurs</StatLabel>
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
                    
                    {/* Affichage en grille des catégories et objets */}
                    <Grid>
                        <Card>
                            <CardTitle>Catégories</CardTitle>
                            <ul className="space-y-2">
                                {categories.map((category, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{category}</span>
                                        <SecondaryButton>Supprimer</SecondaryButton>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card>
                            <CardTitle>Objets</CardTitle>
                            <ul className="space-y-2">
                                {objects.map((object) => (
                                    <li key={object.id} className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{object.name}</span>
                                            <StatusBadge status={object.status} className="ml-2">
                                                {object.status}
                                            </StatusBadge>
                                        </div>
                                        <ButtonGroup>
                                            <SecondaryButton>Modifier</SecondaryButton>
                                            <PrimaryButton>Supprimer</PrimaryButton>
                                        </ButtonGroup>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </Grid>
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
                    {reports.userActivity.map(alert => (
                        <AlertBanner key={alert.date} type="warning">
                            <FaExclamationTriangle />
                            <div>
                                <strong>{alert.activeUsers} utilisateurs actifs</strong>
                                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{alert.date}</div>
                            </div>
                            <ActionButton onClick={() => handleAlertAction(alert)}>
                                Résoudre
                            </ActionButton>
                        </AlertBanner>
                    ))}
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
                                <FaDownload /> Exporter CSV
                            </ExportButton>
                            <ExportButton onClick={() => handleExportReport('userActivity')}>
                                <FaDownload /> Exporter CSV
                            </ExportButton>
                            <ExportButton onClick={() => handleExportReport('serviceUsage')}>
                                <FaDownload /> Exporter CSV
                            </ExportButton>
                        </ButtonGroup>
                    </SectionHeader>

                    {/* Affichage des métriques clés */}
                    <Grid>
                        <Card>
                            <CardTitle>Consommation Énergétique</CardTitle>
                            <StatValue>{reports.energyConsumption.reduce((total, item) => total + item.value, 0)}</StatValue>
                            <StatLabel>Total sur 30 jours</StatLabel>
                        </Card>
                        <Card>
                            <CardTitle>Taux de Connexion</CardTitle>
                            <StatValue>{reports.userActivity.reduce((total, item) => total + item.activeUsers, 0) / users.length * 100}%</StatValue>
                            <StatLabel>Moyenne quotidienne</StatLabel>
                        </Card>
                        <Card>
                            <CardTitle>Services Populaires</CardTitle>
                            <StatValue>{reports.serviceUsage.length}</StatValue>
                            <StatLabel>Services actifs</StatLabel>
                        </Card>
                    </Grid>
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
                        <SectionTitle>Ajouter un objet</SectionTitle>
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
                                <Label>Catégorie</Label>
                                <Select
                                    value={objectFormData.category}
                                    onChange={(e) => setObjectFormData({...objectFormData, category: e.target.value})}
                                >
                                    {categories.map((category, index) => (
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
                                    <option value="active">Actif</option>
                                    <option value="maintenance">En maintenance</option>
                                    <option value="inactive">Inactif</option>
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
                                    Ajouter
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
                        <h2>Résoudre l'alerte</h2>
                        <AlertBanner type={selectedAlert?.type}>
                            {selectedAlert?.message}
                        </AlertBanner>
                        <FormGroup>
                            <Label>Solution appliquée</Label>
                            <Input type="text" placeholder="Décrivez la solution..." />
                        </FormGroup>
                        <FormGroup>
                            <Label>Statut</Label>
                            <Select>
                                <option value="resolved">Résolu</option>
                                <option value="in_progress">En cours</option>
                                <option value="pending">En attente</option>
                            </Select>
                        </FormGroup>
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

export default AdminPage; 