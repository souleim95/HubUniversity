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
  ExportButton, DateBadge
} from '../styles/AdminStyles';
import { FaUsers, FaTools, FaShieldAlt, FaPalette, FaChartBar, FaPlus, FaEdit, FaTrash, FaDownload, FaExclamationTriangle, FaCheck, FaHistory, FaCog, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
// Importer les données depuis fakeData.js
import { dataObjects, equipments, categories, objectTypes } from '../data/projectData';
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
    handlePasswordUpdate,handleViewObject, resetColors,
    OBJECT_STATUS, ROOM_STATUS,
    getObjectStatus, countObjectsByStatus, handleRoomEquipment
  } = useAdminState(platformSettings, setPlatformSettings);
    // --------- Rendu de l'interface ---------
  return (
    <bodyAdmin>
      <AdminContainer>
        {/* En-tête de la page d'administration */}
        <AdminHeader>
          <AdminTitle style={{ color: '#f8f9fa' }}>Administration HubUniversity</AdminTitle>
          <AdminSubtitle style={{ color: '#f8f9fa' }}>
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

            {/* Gestion des catégories */}
            <Card style={{ marginBottom: '2rem' }}>
              <CardTitle>Catégories d'objets</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {categoryList.map((category, index) => (
                  <div key={index} style={{ 
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{category}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {objects.filter(obj => obj.type === category).length} objets
                      </div>
                    </div>
                    {category !== 'Salle' && (
                      <PrimaryButton onClick={() => handleDeleteCategory(category)} style={{ padding: '0.5rem' }}>
                        <FaTrash />
                      </PrimaryButton>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Liste des objets */}
            <Card style={{ marginBottom: '2rem' }}>
              <CardTitle>Objets et Services</CardTitle>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table>
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
                          <StatusBadge status={getObjectStatus(object.status, object.type)}>
                            {object.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <SecondaryButton onClick={() => handleEditObject(object)}>
                              <FaEdit style={{ marginRight: '5px' }} /> Modifier
                            </SecondaryButton>
                            {object.type !== 'Salle' && (
                              <PrimaryButton onClick={() => handleDeleteObject(object.id)}>
                                <FaTrash style={{ marginRight: '5px' }} /> Supprimer
                              </PrimaryButton>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>

            {/* Règles globales */}
            <Card>
              <CardTitle>Règles de fonctionnement globales</CardTitle>
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
            </Card>

            {/* Alertes et Demandes */}
            <SectionHeader style={{ marginTop: '2rem' }}>
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
                    }}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Couleur Texte</Label>
                  <Input
                    type="color"
                    value={platformSettings.colors.secondary}
                    onChange={(e) => {
                      setPlatformSettings(prev => ({
                        ...prev,
                        colors: {
                          ...prev.colors,
                          secondary: e.target.value
                        }
                      }));
                      document.documentElement.style.setProperty('--secondary-color', e.target.value);
                    }}
                  />
                </FormGroup>
                <ActionButton onClick={resetColors} style={{ marginTop: '1rem' }}>
                  Réinitialiser les couleurs
                </ActionButton>
              </Card>

              <Card>
                <CardTitle>Validation des Inscriptions</CardTitle>
                <FormGroup>
                  <Label>Vérification par email @cy-tech.fr</Label>
                  <Select
                    value={platformSettings.validation.requireEmail.toString()}
                    onChange={(e) => {
                      setPlatformSettings(prev => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          requireEmail: e.target.value === 'true'
                        }
                      }));
                    }}
                  >
                    <option value="true">Obligatoire</option>
                    <option value="false">Optionnelle</option>
                  </Select>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    {platformSettings.validation.requireEmail ? 
                      'Les utilisateurs doivent s\'inscrire avec une adresse @cy-tech.fr' :
                      'Les utilisateurs peuvent utiliser n\'importe quelle adresse email'
                    }
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
              <Card style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CardTitle>Consommation Énergétique</CardTitle>
                <StatValue style={{ color: '#4CAF50', fontSize: '2.5rem', margin: '10px 0' }}>
                  {reports.energyConsumption.reduce((total, item) => total + item.value, 0)} kWh
                </StatValue>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <small style={{ color: '#666' }}>Appareils actifs</small>
                    <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {objects.filter(obj => obj.status === 'Actif' || obj.status === 'Allumé').length}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid #eee', paddingLeft: '10px' }}>
                    <small style={{ color: '#666' }}>Total appareils</small>
                    <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {objects.length}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: '#f8faf8',
                  borderRadius: '8px'
                }}>
                  {Object.entries(categories).map(([key, category], index) => (
                    <div key={key} style={{ textAlign: 'center' }}>
                      <div style={{
                        height: '60px',
                        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'][index],
                        borderRadius: '6px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end'
                      }}>
                        <div style={{
                          width: '100%',
                          height: `${(category.items.filter(id => {
                            const obj = objects.find(o => o.id === id);
                            return obj && (obj.status === 'Actif' || obj.status === 'Allumé');
                          }).length / category.items.length) * 100}%`,
                          backgroundColor: ['#388E3C', '#1976D2', '#F57C00'][index],
                          borderRadius: '6px',
                          transition: 'height 0.3s ease'
                        }}/>
                      </div>
                      <small style={{ display: 'block', color: '#666', marginTop: '4px', fontSize: '0.7rem' }}>
                        {category.name}
                      </small>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CardTitle>Activité des Équipements</CardTitle>
                <StatValue style={{ color: '#2196F3', fontSize: '2.5rem', margin: '10px 0' }}>
                  {Math.round((Object.values(equipments).flat().filter(eq => eq.status === 'Actif' || eq.status === 'Allumé').length / Object.values(equipments).flat().length) * 100)}%
                </StatValue>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                  {objectTypes.slice(0, 4).map((type, index) => (
                    <div key={type} style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: `${['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'][index]}22`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <span style={{ 
                          fontSize: '1.2rem', 
                          color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'][index]
                        }}>
                          {Object.values(equipments).flat().filter(eq => eq.type === type).length}
                        </span>
                      </div>
                      <small style={{ color: '#666', fontSize: '0.8rem' }}>{type}</small>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#f8fafe',
                  borderRadius: '8px'
                }}>
                  {['Actif', 'Maintenance', 'Inactif'].map((status, index) => (
                    <div key={status} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>{status}</span>
                      <div style={{
                        flex: 1,
                        margin: '0 10px',
                        height: '8px',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(Object.values(equipments).flat().filter(eq => 
                            status === 'Actif' ? eq.status === 'Actif' || eq.status === 'Allumé' :
                            status === 'Maintenance' ? eq.status === 'Maintenance' :
                            eq.status === 'Inactif' || eq.status === 'Éteint'
                          ).length / Object.values(equipments).flat().length) * 100}%`,
                          height: '100%',
                          backgroundColor: ['#4CAF50', '#FF9800', '#F44336'][index],
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}/>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'right' }}>
                        {Object.values(equipments).flat().filter(eq => 
                          status === 'Actif' ? eq.status === 'Actif' || eq.status === 'Allumé' :
                          status === 'Maintenance' ? eq.status === 'Maintenance' :
                          eq.status === 'Inactif' || eq.status === 'Éteint'
                        ).length}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CardTitle>Occupation des Salles</CardTitle>
                <StatValue style={{ color: '#FF9800', fontSize: '2.5rem', margin: '10px 0' }}>
                  {objects.filter(obj => obj.type === 'Salle' && obj.status === 'Occupée').length} / {objects.filter(obj => obj.type === 'Salle').length}
                </StatValue>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '15px',
                  margin: '20px 0'
                }}>
                  {objects.filter(obj => obj.type === 'Salle').map((salle, index) => (
                    <div key={salle.id} style={{
                      backgroundColor: '#f8f8f8',
                      padding: '10px',
                      borderRadius: '8px',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: salle.status === 'Disponible' ? '#4CAF50' : '#F44336',
                        position: 'absolute',
                        top: '10px',
                        right: '10px'
                      }}/>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#333' }}>
                        {salle.name}
                      </h4>
                      <small style={{ color: '#666' }}>
                        Capacité: {salle.capacity}
                      </small>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: '20px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CardTitle>Services les Plus Utilisés</CardTitle>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '20px'
                }}>
                  {Object.entries(categories).map(([key, category], index) => (
                    <div key={key} style={{
                      backgroundColor: '#f8f8f8',
                      padding: '15px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>{category.name}</span>
                        <span style={{ color: '#666' }}>
                          {category.items.filter(id => {
                            const obj = objects.find(o => o.id === id);
                            return obj && (obj.status === 'Actif' || obj.status === 'Allumé');
                          }).length} actifs
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: '#eee',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(category.items.filter(id => {
                            const obj = objects.find(o => o.id === id);
                            return obj && (obj.status === 'Actif' || obj.status === 'Allumé');
                          }).length / category.items.length) * 100}%`,
                          height: '100%',
                          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'][index],
                          borderRadius: '4px'
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
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
                    onChange={(e) => {
                      const newType = e.target.value;
                      let defaultStatus;
                      switch (newType) {
                        case 'Salle':
                          defaultStatus = OBJECT_STATUS.ROOM.AVAILABLE;
                          break;
                        case 'Équipement':
                          defaultStatus = OBJECT_STATUS.EQUIPMENT.ACTIVE;
                          break;
                        case 'Service':
                          defaultStatus = OBJECT_STATUS.SERVICE.RUNNING;
                          break;
                        case 'Outil':
                          defaultStatus = OBJECT_STATUS.TOOL.AVAILABLE;
                          break;
                        default:
                          defaultStatus = OBJECT_STATUS.ROOM.AVAILABLE;
                      }
                      setObjectFormData({
                        ...objectFormData,
                        type: newType,
                        status: defaultStatus
                      });
                    }}
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
                    {objectFormData.type === 'Salle' && (
                      <>
                        <option value={OBJECT_STATUS.ROOM.AVAILABLE}>Disponible</option>
                        <option value={OBJECT_STATUS.ROOM.OCCUPIED}>Occupée</option>
                      </>
                    )}
                    {objectFormData.type === 'Équipement' && (
                      <>
                        <option value={OBJECT_STATUS.EQUIPMENT.ACTIVE}>Actif</option>
                        <option value={OBJECT_STATUS.EQUIPMENT.INACTIVE}>Inactif</option>
                        <option value={OBJECT_STATUS.EQUIPMENT.MAINTENANCE}>Maintenance</option>
                      </>
                    )}
                    {objectFormData.type === 'Service' && (
                      <>
                        <option value={OBJECT_STATUS.SERVICE.RUNNING}>En cours</option>
                        <option value={OBJECT_STATUS.SERVICE.STOPPED}>Arrêté</option>
                        <option value={OBJECT_STATUS.SERVICE.MAINTENANCE}>En maintenance</option>
                      </>
                    )}
                    {objectFormData.type === 'Outil' && (
                      <>
                        <option value={OBJECT_STATUS.TOOL.AVAILABLE}>Disponible</option>
                        <option value={OBJECT_STATUS.TOOL.IN_USE}>En utilisation</option>
                        <option value={OBJECT_STATUS.TOOL.MAINTENANCE}>En maintenance</option>
                      </>
                    )}
                  </Select>
                </FormGroup>
                {objectFormData.type !== 'Salle' && (
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
                )}
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
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Statut des équipements :</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <span style={{ color: '#4CAF50' }}>Actifs : </span>
                    {selectedEquipmentInfo.equipmentStatus.active}
                  </div>
                  <div>
                    <span style={{ color: '#F44336' }}>Inactifs : </span>
                    {selectedEquipmentInfo.equipmentStatus.inactive}
                  </div>
                  <div>
                    <span style={{ color: '#FFC107' }}>En maintenance : </span>
                    {selectedEquipmentInfo.equipmentStatus.maintenance}
                  </div>
                </div>
              </div>
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