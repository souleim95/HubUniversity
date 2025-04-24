import React from 'react';
import { RiEyeLine, RiEyeOffLine, 
         RiBookLine, RiBuildingLine, RiInformationLine, RiQuestionLine, 
         RiDashboardLine, RiSettings4Line, RiAdminLine, RiUserLine, RiLogoutBoxLine,
         RiSearchLine } from 'react-icons/ri';
import { FaFilter } from 'react-icons/fa';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton,
  LoginFormContainer, 
  Overlay,
  SearchContainer,
  Filter
} from '../styles/HeaderStyles';

import hubCyLogo from '../assets/HubCyLogo.png';
import UserMenu from './UserMenu';
import { objectTypes } from '../data/projectData';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from './Toast';
import { useHeaderState } from '../hooks/useHeader';

/*
 * Composant Header : Barre de navigation principale et gestion des utilisateurs
 * 
 * Fonctionnalités principales :
 * 1. Authentification
 *    - Gestion de la connexion/inscription
 *    - Validation des formulaires
 *    - Gestion des sessions
 * 
 * 2. Navigation
 *    - Menu principal
 *    - Navigation entre les sections
 *    - Défilement automatique
 * 
 * 3. Recherche
 *    - Barre de recherche intégrée
 *    - Filtres avancés
 *    - Résultats en temps réel
 * 
 * 4. Interface utilisateur
 *    - Menu utilisateur
 *    - Affichage des points
 *    - Gestion du rôle
 * 
 * 5. Notifications
 *    - Système de toast
 *    - Alertes utilisateur
 *    - Messages de confirmation
 * 
 * 6. Responsivité
 *    - Adaptation mobile
 *    - Menu burger
 *    - Gestion de la visibilité
 * 
 * 7. États
 *    - Gestion des modals
 *    - États des formulaires
 *    - Configuration de la recherche
 */

const Header = () => {

  // Externalisation de nos const et de nos states dans un fichier constHeader.js
  const {
    handleLogout, handleSubmit,
    handleSelectObject, getRoleTitle, getRoleColor,
    toggleForm, handleChange, removeToast,
    scrollToCampus, scrollToInfo, scrollToFaq,
    handleSearchButtonClick, renderSidebarButton,
    sortedCategories, handleSearch,
    statusTypes, 
    isFormOpen, setIsFormOpen,
    formData, 
    userName, 
    role,
    userPoints, 
    selectedCategory, setSelectedCategory,
    showPassword, setShowPassword,
    toasts,
    isSidebarVisible, setIsSidebarVisible,
    isSearchWindowOpen,
    showFilters, setShowFilters,
    searchText, 
    searchResults, 
    selectedType, setSelectedType,
    selectedStatus, setSelectedStatus,
    navigate
  } = useHeaderState();

  return (
    <>
      {/* Indicateur de barre latérale */}
      <div 
        style={{
          position: 'fixed',
          left: 0,
          top: '55%',
          transform: 'translateY(-50%)',
          width: '5px',
          height: '100px',
          backgroundColor: 'rgb(0,0,0)',
          borderRadius: '0 5px 5px 0',
          transition: 'all 0.3s ease-in-out',
          zIndex: 999,
          cursor: 'pointer',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          animation: 'pulse 2s infinite'
        }}
        onMouseEnter={() => setIsSidebarVisible(true)}
      />

      {/* Style pour l'animation pulse */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.7; }
            100% { opacity: 0.4; }
          }
        `}
      </style>

      {/* Barre latérale avec icônes */}
      <div 
  style={{
    position: 'fixed',
    left: isSidebarVisible ? '20px' : '-70px',
    bottom: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: 'white',
    padding: '15px 10px',
    borderRadius: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    transition: 'left 0.3s ease-in-out',
    maxHeight: 'calc(100vh - 140px)',
    overflowY: 'auto',
  }}
>


        {/* Zone de détection pour faire apparaître la barre */}
        <div 
          style={{
            position: 'absolute',
            left: '-20px',
            top: 0,
            width: '20px',
            height: '100%',
          }}
        />
        
        {/* Boutons existants... sans le bouton de recherche et son séparateur */}
        {renderSidebarButton(() => navigate('/formation'), <RiBookLine size={20} />, "Nos formations")}
        {renderSidebarButton(scrollToCampus, <RiBuildingLine size={20} />, "Campus")}
        {renderSidebarButton(scrollToInfo, <RiInformationLine size={20} />, "Informations")}
        {renderSidebarButton(scrollToFaq, <RiQuestionLine size={20} />, "FAQ")}

        {userName && (
          <>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0', margin: '5px 0' }} />
            {renderSidebarButton(() => navigate('/dashboard'), <RiDashboardLine size={20} />, "Tableau de bord")}
            {renderSidebarButton(() => navigate('/profil'), <RiUserLine size={20} />, "Profil")}
            
            {(role === 'professeur' || role === 'directeur') && (
              renderSidebarButton(() => navigate('/gestion'), <RiSettings4Line size={20} />, "Gestion")
            )}
            
            {role === 'directeur' && (
              renderSidebarButton(() => navigate('/admin'), <RiAdminLine size={20} />, "Administration")
            )}

            {renderSidebarButton(handleLogout, <RiLogoutBoxLine size={20} />, "Déconnexion", '#ffebee')}
          </>
        )}
      </div>

      <HeaderContainer>

        <Toast messages={toasts} removeToast={removeToast} />
        <WelcomeChoices>
          <a href="/">
            <img src={hubCyLogo} alt="HubCY" />
          </a>
        </WelcomeChoices>

        <NavLinks>
          {/* Conteneur flex pour organiser verticalement */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Boutons de navigation toujours visibles */}
            <div style={{ 
  display: 'flex', 
  flexWrap: 'wrap', 
  justifyContent: 'center',
  gap: '0.7rem',
  rowGap: '0.7rem'
}}>

              <ConnectButton onClick={() => navigate('/formation')}>
                Nos formations
              </ConnectButton>
              <ConnectButton onClick={scrollToCampus}>
                Campus
              </ConnectButton>
              <ConnectButton onClick={scrollToInfo}>
                Informations
              </ConnectButton>
              <ConnectButton onClick={scrollToFaq}>
                FAQ
              </ConnectButton>
            </div>

            {/* Information utilisateur ou bouton de connexion */}
            {userName ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#f5f5f5', 
                padding: '6px 12px', 
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                  Bonjour {userName}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    backgroundColor: '#FFC107', 
                    color: '#333', 
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {userPoints} pts
                  </span>
                  <span style={{ 
                    backgroundColor: getRoleColor(role), 
                    color: 'white', 
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {getRoleTitle(role)}
                  </span>
                </div>
              </div>
            ) : (
              <ConnectButton onClick={() => toggleForm('login')}>
                Connexion
              </ConnectButton>
            )}
          </div>
        </NavLinks>

        <SearchContainer>
          {/*
          <SearchBox 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedRoom={setSelectedRoom}
            setSelectedEquipment={setSelectedEquipment}
            onSelectObject={handleSelectObject}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onOpen={() => {
              // Fermer la fenêtre flottante si elle est ouverte
              if (isSearchWindowOpen) {
                setIsSearchWindowOpen(false);
              }
            }}
          />*/}
          {userName && (
            <UserMenu 
              user={{ login: userName }}
              role={role}
              onLogout={handleLogout}
            />
          )}
        </SearchContainer>

              {(isFormOpen === 'signup' || isFormOpen === 'login') && (
          <>
            <Overlay onClick={() => setIsFormOpen(null)} />
            <LoginFormContainer>
              <h2>{isFormOpen === 'signup' ? 'Inscription' : 'Connexion'}</h2>
              <form onSubmit={handleSubmit}>
                {/* Champ Nom complet */}
                {isFormOpen === 'signup' && (
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Nom complet" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                )}

                {/* Champ prénom */}
                <input 
                  type="text" 
                  name="prenom" 
                  placeholder="Prénom" 
                  value={formData.prenom} 
                  onChange={handleChange} 
                  required 
                />

                {/* Champ nom */}
                <input 
                  type="text" 
                  name="nom" 
                  placeholder="Nom" 
                  value={formData.nom} 
                  onChange={handleChange} 
                  required 
                />

                {/* Champ date de naissance */}
                <input 
                  type="date" 
                  name="dateNaissance" 
                  placeholder="Date de naissance" 
                  value={formData.dateNaissance} 
                  onChange={handleChange} 
                  required 
                />

                  <input 
                    type="text" 
                    name="pseudonyme" 
                    placeholder="Pseudonyme" 
                    value={formData.pseudonyme} 
                    onChange={handleChange} 
                    required 
                  />
                  <select 
                    name="genre" 
                    value={formData.genre} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Sélectionnez votre genre</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>


                
                {/* Champ Email */}
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />

                {/* Champ Mot de passe */}
                <div className="password-input">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Mot de passe" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>

                {/* Champ rôle (sélection d'étudiant ou enseignant) */}
                {isFormOpen === 'signup' && (
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Sélectionnez votre rôle</option>
                    <option value="eleve">Étudiant</option>
                    <option value="professeur">Enseignant</option>
                  </select>
                )}

                {/* Champ formation obligatoire */}
                {isFormOpen === 'signup' && (
                  <select name="formation" value={formData.formation} onChange={handleChange} required>
                    <option value="">Sélectionnez votre formation</option>
                    <option value="INFORMATIQUE">INFORMATIQUE</option>
                    <option value="GÉNIE CIVIL">GÉNIE CIVIL</option>
                    <option value="BIOTECHNOLOGIES">BIOTECHNOLOGIES</option>
                    <option value="MÉCANIQUE">MÉCANIQUE</option>
                    <option value="MATHÉMATIQUES APPLIQUÉES">MATHÉMATIQUES APPLIQUÉES</option>
                    <option value="BIOTECHNOLOGIES & CHIMIE (Chimie voie Recherche)">BIOTECHNOLOGIES & CHIMIE (Chimie voie Recherche)</option>
                    <option value="BIOTECHNOLOGIES & CHIMIE (Biologie voie Recherche)">BIOTECHNOLOGIES & CHIMIE (Biologie voie Recherche)</option>
                    <option value="GÉNIE CIVIL - ARCHITECTE (ENSA-V)">GÉNIE CIVIL - ARCHITECTE (ENSA-V)</option>
                    <option value="DATA - HUMANITÉS DIGITALES (Sciences Po Saint-Germain-en-Laye)">DATA - HUMANITÉS DIGITALES (Sciences Po Saint-Germain-en-Laye)</option>
                    <option value="INFORMATIQUE - DESIGNER (CY École de Design)">INFORMATIQUE - DESIGNER (CY École de Design)</option>
                  </select>
                )}

                {/* Bouton d'envoi */}
                <button type="submit">
                  {isFormOpen === 'signup' ? 'Créer un compte' : 'Se connecter'}
                </button>

                {/* Lien pour changer de formulaire */}
                <p>
                  {isFormOpen === 'login' ? 'Pas encore inscrit ?' : 'Déjà un compte ?'}{' '}
                  <button 
                    type="button" 
                    onClick={() => toggleForm(isFormOpen === 'login' ? 'signup' : 'login')} 
                    className="switch-form"
                  >
                    {isFormOpen === 'login' ? 'Inscription' : 'Connexion'}
                  </button>
                </p>

                {/* Bouton de fermeture */}
                <button type="button" onClick={() => setIsFormOpen(null)} className="close-btn">
                  Fermer
                </button>
              </form>
            </LoginFormContainer>
          </>
        )}
        <ToastContainer />
      </HeaderContainer>

      {/* Boutons flottants en bas à droite */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1001,
      }}>
        {/* Fenêtre de recherche flottante */}
        {isSearchWindowOpen && (
          <div 
            id="search-window"
            onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '10px',
              width: window.innerWidth <= 480 ? '90vw' : '400px',
              maxWidth: '100%',
              height: '500px',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            {/* Header avec titre et bouton filtre uniquement */}
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0f6ead',
              color: 'white'
            }}>
              <h3 style={{ margin: 0 }}>Recherche HubCY</h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <FaFilter 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowFilters(!showFilters)}
                />
              </div>
            </div>

            {/* Zone des filtres (conditionnelle) */}
            {showFilters && (
              <div style={{
                padding: '10px',
                backgroundColor: '#f8f8f8',
                borderBottom: '1px solid #eee',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <Filter 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  size="5"
                >
                  <option value="all">Types</option>
                  {objectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Filter>
                  
                <Filter 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="5"
                >
                  <option value="all">Statuts</option>
                  {statusTypes.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Filter>

                <Filter 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="5"
                >
                  <option value="all" backgroundColor="white">Catégories</option>
                  {sortedCategories.map(category => (
                    <option key={category.key} value={category.key}>
                      {category.name}
                    </option>
                  ))}
                </Filter>
              </div>
            )}

            {/* Zone des résultats (scrollable) - Mise à jour */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectObject(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      border: '1px solid #eee',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.borderColor = '#0f6ead';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#eee';
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{item.name}</span>
                      <span style={{
                        fontSize: '0.8em',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: item.type === 'Salle' ? '#0f6ead' : '#4caf50',
                        color: 'white'
                      }}>
                        {item.type}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '0.9em', 
                      color: '#666',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{item.id}</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: item.status === 'Disponible' ? '#4caf50' : '#f44336',
                        color: 'white',
                        fontSize: '0.8em'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#666',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  {searchText ? 'Aucun résultat trouvé pour votre recherche' : 'Commencez à taper pour rechercher'}
                </div>
              )}
            </div>

{/* Barre de recherche fixée en bas */}
<div
  style={{
    padding: '8px',
    borderTop: '1px solid #eee',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 2,
    boxSizing: 'border-box',
  }}
>

  <input
    type="text"
    value={searchText}
    onChange={handleSearch}
    placeholder="Rechercher par nom ou identifiant..."
    style={{
      width: '100%',
      padding: window.innerWidth <= 480 ? '8px 10px' : '10px 15px',
      fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem',
      borderRadius: '20px',
      border: '1px solid #ddd',
      outline: 'none',
      boxSizing: 'border-box'
    }}
  />
</div>

          </div>
        )}

        {/* Bouton de recherche */}
        <div
          id="search-button"
          onClick={handleSearchButtonClick}
          style={{
            width: '45px',
            height: '45px',
            backgroundColor: '#0f6ead',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#0d5c91';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#0f6ead';
          }}
        >
          <RiSearchLine size={24} color="white" />
        </div>


      </div>

      {/* Animation pour la fenêtre flottante */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
