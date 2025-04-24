/*
 * Composant AdminPage : Interface d'administration complète
 * - Gestion des utilisateurs (CRUD, rôles, droits)
 * - Gestion des objets et services (CRUD, catégories, états)
 * - Administration de la sécurité et maintenance
 * - Personnalisation de la plateforme (thèmes, validation)
 * - Génération de rapports et statistiques
 * - Gestion des alertes et des demandes
 * - Suivi des métriques et performances
 * - Interface organisée par onglets pour une navigation claire
 * - Modals pour les actions importantes
 * - Système de confirmation pour les actions critiques
 */

import React, { useContext } from 'react';

import {
  AdminContainer, AdminHeader, AdminTitle, AdminSubtitle,
  Section, SectionHeader, SectionTitle,
  ActionButton,
  Table, TableHeader, TableHeaderCell, TableRow, TableCell,
  Grid,
  Card, CardTitle,
  StatusBadge,
  ModalOverlay, ModalContent,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonGroup, SecondaryButton, PrimaryButton,
  StatsGrid, StatCard, StatValue, StatLabel,
  AlertBanner,
  TabsContainer, TabsList, Tab,
  ExportButton
} from '../styles/AdminStyles';
import { FaUsers, FaTools, FaShieldAlt, FaPalette, FaChartBar, FaPlus, FaEdit, FaTrash, FaDownload, FaExclamationTriangle, FaCheck, FaHistory, FaCog, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
// Importer les données depuis fakeData.js
import { dataObjects, equipments } from '../data/projectData';
import { PlatformContext } from '../context/PlatformContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminState } from '../hooks/useAdmin';

function AdminPage() {
  const { platformSettings, setPlatformSettings } = useContext(PlatformContext);

  // Externalisation de nos const et de nos states dans un fichier constAdmin.js
  const {
    applyGlobalRules, 
	  users, alerts, setAlerts,
    loadingUsers, 
    showUserModal, setShowUserModal,
    selectedUser, 
    showUserPassword, setShowUserPassword,
    userFormData, setUserFormData,
    objects, setObjects,
    categoryList, 
    showObjectModal, setShowObjectModal,
    objectFormData, setObjectFormData,
    newCategory, setNewCategory,
    showCategoryModal, setShowCategoryModal,
    globalRules, setGlobalRules,
    reports,
    activeTab, setActiveTab,
    showAlertModal, setShowAlertModal,
    selectedObject, 
    selectedAlert, 
    userHistory,
    historyFilter, setHistoryFilter,
    showDeleteUserModal, setShowDeleteUserModal,
    showDeleteCategoryModal, setShowDeleteCategoryModal,
    showDeleteObjectModal, setShowDeleteObjectModal,
    showEquipmentModal, setShowEquipmentModal,
    showApproveModal, setShowApproveModal,
    selectedItemToDelete,
    selectedEquipmentInfo, 
    lastBackup,
    lastIntegrityCheck,
    isBackupInProgress, 
    isIntegrityCheckInProgress, 
    showPassword, setShowPassword,
    handleAddUser, filterHistory,
    handleEditUser, handleDeleteUser,
    handleUserSubmit, confirmDeleteUser,
    handleAddObject, handleAddCategory,
    handleCategorySubmit, handleDeleteCategory,
    confirmDeleteCategory, confirmDeleteObject,
    handleEditObject,
    handleDeleteObject, handleApproveRequest, confirmApproveRequest,
    handleObjectSubmit, handleExportReport,
    handleShowEquipment,
    handleBackup, handleIntegrityCheck,
    handlePasswordUpdate,handleViewObject,
  } = useAdminState(platformSettings, setPlatformSettings);
    // --------- Rendu de l'interface ---------
  return (
    <bodyAdmin>
      <ToastContainer />
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
              <FaTools /> Objets & Services
            </Tab>
            <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
              <FaShieldAlt /> Sécurité & Maintenance
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
                    <TableHeaderCell>Email</TableHeaderCell>        
                    <TableHeaderCell>Rôle</TableHeaderCell>
                    <TableHeaderCell>Points</TableHeaderCell>
                    <TableHeaderCell>Inscription</TableHeaderCell>
                    <TableHeaderCell>Dernière Connexion</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.role}>
                          {user.role}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{user.points}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <ButtonGroup>
                          <SecondaryButton onClick={() => handleEditUser(user)}>
                            <FaEdit /> Modifier
                          </SecondaryButton>
                          <PrimaryButton onClick={() => handleDeleteUser(user.id)}>
                            <FaTrash /> Supprimer
                          </PrimaryButton>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Nouvelle section pour l'historique */}
            <SectionHeader style={{ marginTop: '30px' }}>
              <SectionTitle><FaHistory /> Historique des Actions</SectionTitle>
            </SectionHeader>
            
            {/* Filtres */}
            <Grid style={{ marginBottom: '20px' }}>
              <Card>
                <CardTitle>Filtres</CardTitle>
                <FormGroup>
                  <Label>Type d'action</Label>
                  <Select
                    value={historyFilter.type}
                    onChange={(e) => setHistoryFilter({...historyFilter, type: e.target.value})}
                  >
                    <option value="all">Toutes les actions</option>
                    <option value="Connexion">Connexions</option>
                    <option value="Déconnexion">Déconnexions</option>
                    <option value="Modification">Modifications</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Date de début</Label>
                  <Input
                    type="date"
                    value={historyFilter.dateFrom}
                    onChange={(e) => setHistoryFilter({...historyFilter, dateFrom: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={historyFilter.dateTo}
                    onChange={(e) => setHistoryFilter({...historyFilter, dateTo: e.target.value})}
                  />
                </FormGroup>
              </Card>
            </Grid>

            {/* Tableau des historiques */}
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Utilisateur</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                  <TableHeaderCell>Date/Heure</TableHeaderCell>
                  <TableHeaderCell>Détails</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {filterHistory(userHistory).map((entry) => {
                  const user = users.find(u => u.id === entry.userId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{user ? user.login : 'Utilisateur inconnu'}</TableCell>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{entry.details}</TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </Section>
        )}

        {/* Contenu de l'onglet Objets & Services */}
        {activeTab === 'objects' && (
          <Section>
            <SectionHeader>
              <SectionTitle><FaTools /> Gestion des Objets et Services</SectionTitle>
              <ButtonGroup>
                <ActionButton onClick={handleAddObject}>
                  <FaPlus /> Ajouter un objet
                </ActionButton>
                <ActionButton onClick={handleAddCategory}>
                  <FaPlus /> Ajouter une catégorie
                </ActionButton>
              </ButtonGroup>
            </SectionHeader>

            {/* Liste des objets et catégories */}
            <Grid style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Liste des types d'objets */}
              <Card style={{ gridColumn: '1 / span 1' }}>
                <CardTitle>Types d'Objets</CardTitle>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0}}>
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
                      <PrimaryButton onClick={() => handleDeleteCategory(category)} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem' }}>
                        <FaTrash style={{ marginRight: '5px' }} />
                      </PrimaryButton>
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
                    Actifs: {objects.filter(obj => 
                      obj.status === 'Actif' || 
                      obj.status === 'Allumé' || 
                      obj.status === 'Disponible' || 
                      obj.status === 'En marche'
                    ).length}
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
                    Inactifs: {objects.filter(obj => 
                      obj.status === 'Inactif' || 
                      obj.status === 'Éteint' || 
                      obj.status === 'Hors service' || 
                      obj.status === 'Arrêté'
                    ).length}
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
                    Maintenance: {objects.filter(obj => 
                      obj.status === 'Maintenance' || 
                      obj.status === 'En réparation' || 
                      obj.status === 'En cours de maintenance'
                    ).length}
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
                              object.status === 'Actif' || 
                              object.status === 'Allumé' || 
                              object.status === 'Disponible' || 
                              object.status === 'En marche' ? 'active' :
                              object.status === 'Maintenance' || 
                              object.status === 'En réparation' || 
                              object.status === 'En cours de maintenance' ? 'maintenance' : 'inactive'
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
                    const room = dataObjects.find(obj => obj.id === roomId);
                    if (!room) return null;
                    
                    return (
                      <TableRow key={roomId} style={{ cursor: 'pointer' }} onClick={() => {
                        handleShowEquipment(room);
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
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Règles globales */}
            <SectionHeader style={{ marginTop: '20px' }}>
              <SectionTitle><FaCog /> Règles Globales</SectionTitle>
            </SectionHeader>
            <Grid>
              <Card>
                <CardTitle>Priorités Énergétiques</CardTitle>
                <FormGroup>
                  <Label>Mode de fonctionnement</Label>
                  <Select
                    name="energyPriority"
                    value={globalRules.energyPriority}
                    onChange={(e) => {
                      setGlobalRules({...globalRules, energyPriority: e.target.value});
                      applyGlobalRules();
                    }}
                  >
                    <option value="performance">Performance Maximale</option>
                    <option value="balanced">Équilibré</option>
                    <option value="economy">Économie d'Énergie</option>
                  </Select>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    {globalRules.energyPriority === 'performance' ? 'Tous les objets sont maintenus actifs' :
                     globalRules.energyPriority === 'economy' ? 'Les objets à faible priorité sont éteints' :
                     'Équilibre entre performance et économie d\'énergie'}
                  </p>
                </FormGroup>
              </Card>
              <Card>
                <CardTitle>Gestion des Alertes</CardTitle>
                <FormGroup>
                  <Label>Seuil d'Alerte (%)</Label>
                  <Input
                    type="number"
                    name="alertThreshold"
                    value={globalRules.alertThreshold}
                    onChange={(e) => {
                      setGlobalRules({...globalRules, alertThreshold: parseInt(e.target.value)});
                      applyGlobalRules();
                    }}
                    min="0"
                    max="100"
                  />
                  <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    Une alerte sera déclenchée si plus de {globalRules.alertThreshold}% des objets sont actifs
                  </p>
                </FormGroup>
              </Card>
              <Card>
                <CardTitle>Programmation Automatique</CardTitle>
                <FormGroup>
                  <Label>Arrêt automatique</Label>
                  <Select
                    name="autoShutdown"
                    value={globalRules.autoShutdown}
                    onChange={(e) => {
                      setGlobalRules({...globalRules, autoShutdown: e.target.value === 'true'});
                      applyGlobalRules();
                    }}
                  >
                    <option value="true">Activé</option>
                    <option value="false">Désactivé</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Heure d'arrêt</Label>
                  <Input
                    type="time"
                    name="shutdownTime"
                    value={globalRules.shutdownTime}
                    onChange={(e) => {
                      setGlobalRules({...globalRules, shutdownTime: e.target.value});
                      applyGlobalRules();
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Heure de démarrage</Label>
                  <Input
                    type="time"
                    name="startupTime"
                    value={globalRules.startupTime}
                    onChange={(e) => {
                      setGlobalRules({...globalRules, startupTime: e.target.value});
                      applyGlobalRules();
                    }}
                  />
                </FormGroup>
              </Card>
            </Grid>

            {/* Alertes et Demandes */}
            <SectionHeader style={{ marginTop: '20px' }}>
              <SectionTitle><FaExclamationTriangle /> Alertes et Demandes</SectionTitle>
            </SectionHeader>

            <Grid>
              {/* Alertes en cours */}
              <Card style={{ gridColumn: 'span 2' }}>
                <CardTitle>Alertes Actives</CardTitle>
                {alerts.filter(alert => alert.type === 'alert' && alert.status === 'pending').map(alert => (
                  <AlertBanner key={alert.id} type={alert.priority === 'high' ? 'error' : 'warning'}>
                    <FaExclamationTriangle />
                    <div>
                      <strong>{alert.title}</strong>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{alert.message}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <ButtonGroup>
                      <SecondaryButton onClick={() => {
                        setAlerts(alerts.map(a => 
                          a.id === alert.id ? { ...a, status: 'resolved' } : a
                        ));
                        toast.success('Alerte marquée comme résolue');
                      }}>
                        Résoudre
                      </SecondaryButton>
                      <PrimaryButton onClick={() => handleViewObject(alert.objectId)}>
                        Voir l'objet
                      </PrimaryButton>
                    </ButtonGroup>
                  </AlertBanner>
                ))}
                {alerts.filter(alert => alert.type === 'alert' && alert.status === 'pending').length === 0 && (
                  <AlertBanner type="success">
                    <FaCheck />
                    <div>
                      <strong>Aucune alerte active</strong>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Tous les systèmes fonctionnent normalement</div>
                    </div>
                  </AlertBanner>
                )}
              </Card>

              {/* Demandes des gestionnaires */}
              <Card style={{ gridColumn: 'span 2' }}>
                <CardTitle>Demandes en Attente</CardTitle>
                {alerts.filter(alert => alert.type === 'request' && alert.status === 'pending').map(alert => (
                  <AlertBanner key={alert.id} type="info">
                    <FaUser />
                    <div>
                      <strong>{alert.title}</strong>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{alert.message}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                        Demandé par: {alert.requester} - {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <ButtonGroup>
                      <SecondaryButton onClick={() => {
                        setAlerts(alerts.map(a => 
                          a.id === alert.id ? { ...a, status: 'rejected' } : a
                        ));
                        toast.error('Demande rejetée');
                      }}>
                        Rejeter
                      </SecondaryButton>
                      <PrimaryButton onClick={() => handleApproveRequest(alert)}>
                        Approuver
                      </PrimaryButton>
                    </ButtonGroup>
                  </AlertBanner>
                ))}
                {alerts.filter(alert => alert.type === 'request' && alert.status === 'pending').length === 0 && (
                  <AlertBanner type="success">
                    <FaCheck />
                    <div>
                      <strong>Aucune demande en attente</strong>
                      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Toutes les demandes ont été traitées</div>
                    </div>
                  </AlertBanner>
                )}
              </Card>
            </Grid>

            {/* Historique des alertes et demandes */}
            <SectionHeader style={{ marginTop: '20px' }}>
              <SectionTitle><FaHistory /> Historique des Alertes et Demandes</SectionTitle>
            </SectionHeader>
            
            {alerts.filter(alert => alert.status !== 'pending').length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px dashed #dee2e6',
                margin: '20px 0'
              }}>
                <FaHistory style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '1rem' }} />
                <p style={{ color: '#6c757d', margin: 0 }}>Historique vide</p>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Les alertes et demandes traitées apparaîtront ici
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Titre</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Statut</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {alerts.filter(alert => alert.status !== 'pending').map(alert => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <StatusBadge status={alert.type === 'alert' ? 'warning' : 'info'}>
                          {alert.type === 'alert' ? 'Alerte' : 'Demande'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{alert.title}</TableCell>
                      <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={
                          alert.status === 'resolved' || alert.status === 'approved' ? 'success' : 'error'
                        }>
                          {alert.status === 'resolved' ? 'Résolu' : 
                           alert.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup>
                          <SecondaryButton onClick={() => handleViewObject(alert.objectId)}>
                            Voir l'objet
                          </SecondaryButton>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </Section>
        )}

        {/* Contenu de l'onglet Sécurité & Maintenance */}
        {activeTab === 'security' && (
          <Section>
            <SectionHeader>
              <SectionTitle><FaShieldAlt /> Sécurité et Maintenance</SectionTitle>
            </SectionHeader>
            <Grid>
              <Card>
                <CardTitle>Gestion des Accès</CardTitle>
                <form onSubmit={handlePasswordUpdate}>
                  <FormGroup>
                    <Label>Mise à jour du mot de passe admin</Label>
                    <div style={{ position: 'relative' }}>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        name="newPassword" 
                        placeholder="Nouveau mot de passe" 
                        required 
                        minLength="8"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormGroup>
                  <ActionButton type="submit">Mettre à jour</ActionButton>
                </form>
              </Card>
              <Card>
                <CardTitle>Sauvegarde</CardTitle>
                <FormGroup>
                  <Label>Dernière sauvegarde</Label>
                  <p>{lastBackup}</p>
                </FormGroup>
                <ActionButton 
                  onClick={handleBackup}
                  disabled={isBackupInProgress}
                >
                  {isBackupInProgress ? 'En cours...' : 'Effectuer une sauvegarde'}
                </ActionButton>
              </Card>
              <Card>
                <CardTitle>Vérification d'Intégrité</CardTitle>
                <FormGroup>
                  <Label>Dernière vérification</Label>
                  <p>{lastIntegrityCheck}</p>
                </FormGroup>
                <ActionButton 
                  onClick={handleIntegrityCheck}
                  disabled={isIntegrityCheckInProgress}
                >
                  {isIntegrityCheckInProgress ? 'En cours...' : 'Lancer la vérification'}
                </ActionButton>
              </Card>
            </Grid>
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
                    onChange={(e) => {
                      setPlatformSettings(prev => ({
                        ...prev,
                        theme: e.target.value
                      }));
                      document.documentElement.setAttribute('data-theme', e.target.value);
                      toast.success(`Thème ${e.target.value === 'light' ? 'clair' : 'sombre'} appliqué`);
                    }}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </Select>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    Le thème {platformSettings.theme === 'light' ? 'clair' : 'sombre'} est actuellement actif
                  </p>
                </FormGroup>
              </Card>
              <Card>
                <CardTitle>Validation des Inscriptions</CardTitle>
                <FormGroup>
                  <Label>Mode de validation</Label>
                  <Select
                    value={platformSettings.validationRules.validationMode}
                    onChange={(e) => {
                      setPlatformSettings(prev => ({
                        ...prev,
                        validationRules: {
                          ...prev.validationRules,
                          validationMode: e.target.value
                        }
                      }));
                      toast.success(`Mode de validation ${e.target.value} appliqué`);
                    }}
                  >
                    <option value="automatique">Automatique</option>
                    <option value="manuel">Manuel</option>
                    <option value="hybride">Hybride</option>
                  </Select>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    Mode actuel : {platformSettings.validationRules.validationMode}
                  </p>
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

            {/* Statistiques */}
            <Grid>
              <Card>
                <CardTitle>Consommation Énergétique</CardTitle>
                <StatValue>{reports.energyConsumption.reduce((total, item) => total + item.value, 0)}</StatValue>
                <StatLabel>Total kWh sur 30 jours</StatLabel>
              </Card>
              <Card>
                <CardTitle>Taux de Connexion</CardTitle>
                <StatValue>{Math.round((users.filter(u => u.lastLogin).length / users.length) * 100)}%</StatValue>
                <StatLabel>Utilisateurs actifs</StatLabel>
              </Card>
              <Card>
                <CardTitle>Services Populaires</CardTitle>
                <StatValue>{reports.serviceUsage.sort((a, b) => b.usage - a.usage)[0]?.service || 'Aucun'}</StatValue>
                <StatLabel>Service le plus utilisé</StatLabel>
              </Card>
            </Grid>

            {/* Graphiques détaillés */}
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
                  {dataObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length} / {dataObjects.filter(obj => obj.type === 'Salle').length}
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
                      width: `${(dataObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length / dataObjects.filter(obj => obj.type === 'Salle').length) * 100}%`, 
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
                      {Math.round((dataObjects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length / dataObjects.filter(obj => obj.type === 'Salle').length) * 100)}%
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
                    <div style={{ position: 'relative' }}>
                      <Input
                        type={showUserPassword ? "text" : "password"}
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowUserPassword(!showUserPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showUserPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
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
                    <option value="Allumé">Allumé</option>
                    <option value="En marche">En marche</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Inactif">Inactif</option>
                    <option value="Éteint">Éteint</option>
                    <option value="Hors service">Hors service</option>
                    <option value="Arrêté">Arrêté</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="En réparation">En réparation</option>
                    <option value="En cours de maintenance">En cours de maintenance</option>
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

        {/* Modal pour la gestion des catégories */}
        {showCategoryModal && (
          <ModalOverlay onClick={() => setShowCategoryModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Ajouter une catégorie</SectionTitle>
              <form onSubmit={handleCategorySubmit}>
                <FormGroup>
                  <Label>Nom de la catégorie</Label>
                  <Input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                </FormGroup>
                <ButtonGroup>
                  <SecondaryButton type="button" onClick={() => setShowCategoryModal(false)}>
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

        {/* Modal de confirmation de suppression */}
        {showDeleteUserModal && (
          <ModalOverlay onClick={() => setShowDeleteUserModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Confirmer la suppression</SectionTitle>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => setShowDeleteUserModal(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton onClick={confirmDeleteUser}>
                  Confirmer
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {showDeleteCategoryModal && (
          <ModalOverlay onClick={() => setShowDeleteCategoryModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Confirmer la suppression</SectionTitle>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Êtes-vous sûr de vouloir supprimer la catégorie "{selectedItemToDelete}" ?
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => setShowDeleteCategoryModal(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton onClick={confirmDeleteCategory}>
                  Confirmer
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {showDeleteObjectModal && (
          <ModalOverlay onClick={() => setShowDeleteObjectModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Confirmer la suppression</SectionTitle>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Êtes-vous sûr de vouloir supprimer cet objet ?
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => setShowDeleteObjectModal(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton onClick={confirmDeleteObject}>
                  Confirmer
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {showEquipmentModal && (
          <ModalOverlay onClick={() => setShowEquipmentModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Équipements de la salle</SectionTitle>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                {selectedEquipmentInfo.roomName} contient {selectedEquipmentInfo.equipmentCount} équipements
              </p>
              <ButtonGroup>
                <PrimaryButton onClick={() => setShowEquipmentModal(false)}>
                  Fermer
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Modal de confirmation d'approbation */}
        {showApproveModal && (
          <ModalOverlay onClick={() => setShowApproveModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <SectionTitle>Confirmer l'approbation</SectionTitle>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Êtes-vous sûr de vouloir approuver cette demande ?
              </p>
              <ButtonGroup>
                <SecondaryButton onClick={() => setShowApproveModal(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton onClick={confirmApproveRequest}>
                  Confirmer
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </AdminContainer>
    </bodyAdmin>
  );
}

export default AdminPage;