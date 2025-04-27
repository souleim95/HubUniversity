import React from 'react';
import { 
  RiEyeLine, RiEyeOffLine, RiSearchLine, 
  RiBookLine, RiBuildingLine, RiInformationLine, RiQuestionLine, 
  RiDashboardLine, RiSettings4Line, RiAdminLine, RiUserLine, RiLogoutBoxLine 
} from 'react-icons/ri';
import { FaFilter } from 'react-icons/fa';
import { 
  HeaderContainer, WelcomeChoices, NavLinks, ConnectButton, 
  LoginFormContainer, Overlay, SearchContainer, Filter 
} from '../styles/HeaderStyles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import hubCyLogo from '../assets/HubCyLogo.png';
import UserMenu from './UserMenu';
import { objectTypes } from '../data/projectData';
import { useHeaderState } from '../hooks/useHeader';

const Header = () => {
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
      {/* Barre latérale */}
      <div style={{
        position: 'fixed', left: 0, top: '55%', transform: 'translateY(-50%)',
        width: '5px', height: '100px', backgroundColor: 'black', borderRadius: '0 5px 5px 0',
        cursor: 'pointer', zIndex: 999, animation: 'pulse 2s infinite'
      }} onMouseEnter={() => setIsSidebarVisible(true)} />

      <div style={{
        position: 'fixed', left: isSidebarVisible ? '20px' : '-70px',
        bottom: '100px', display: 'flex', flexDirection: 'column', gap: '15px',
        backgroundColor: 'white', padding: '15px 10px', borderRadius: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000, transition: 'left 0.3s ease-in-out'
      }}>
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

      {/* Header principal */}
      <HeaderContainer>
        <WelcomeChoices>
          <a href="/"><img src={hubCyLogo} alt="HubCY" /></a>
        </WelcomeChoices>

        <NavLinks>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.7rem' }}>
              <ConnectButton onClick={() => navigate('/formation')}>Nos formations</ConnectButton>
              <ConnectButton onClick={scrollToCampus}>Campus</ConnectButton>
              <ConnectButton onClick={scrollToInfo}>Informations</ConnectButton>
              <ConnectButton onClick={scrollToFaq}>FAQ</ConnectButton>
            </div>
            {userName ? (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
                <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Bonjour {userName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#FFC107', color: '#333', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{userPoints} pts</span>
                  <span style={{ backgroundColor: getRoleColor(role), color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{getRoleTitle(role)}</span>
                </div>
              </div>
            ) : (
              <ConnectButton onClick={() => toggleForm('login')}>Connexion</ConnectButton>
            )}
          </div>
        </NavLinks>

        <SearchContainer>
          {userName && (
            <UserMenu user={{ login: userName }} role={role} onLogout={handleLogout} />
          )}
        </SearchContainer>

        {/* Formulaire de connexion/inscription */}
        {(isFormOpen === 'signup' || isFormOpen === 'login') && (
          <>
            <Overlay onClick={() => setIsFormOpen(null)} />
            <LoginFormContainer>
              <h2>{isFormOpen === 'signup' ? 'Inscription' : 'Connexion'}</h2>
              <form onSubmit={handleSubmit}>
  {isFormOpen === 'signup' && (
    <>
      <input 
        type="text" 
        name="prenom" 
        placeholder="Prénom" 
        value={formData.prenom || ''} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="name" 
        placeholder="Nom" 
        value={formData.name || ''} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="date" 
        name="dateNaissance" 
        placeholder="Date de naissance" 
        value={formData.dateNaissance || ''} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="pseudonyme" 
        placeholder="Pseudonyme" 
        value={formData.pseudonyme || ''} 
        onChange={handleChange} 
        required 
      />
      <select 
        name="genre" 
        value={formData.genre || ''} 
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez votre genre</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
        <option value="Autre">Autre</option>
      </select>
    </>
  )}

  {/* Ces deux champs sont affichés dans tous les cas (connexion ET inscription) */}
  <input 
    type="email" 
    name="email" 
    placeholder="Email" 
    value={formData.email || ''} 
    onChange={handleChange} 
    required 
  />
  <div className="password-input">
    <input 
      type={showPassword ? "text" : "password"} 
      name="password" 
      placeholder="Mot de passe" 
      value={formData.password || ''} 
      onChange={handleChange} 
      required 
    />
    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
    </button>
  </div>

  {isFormOpen === 'signup' && (
    <>
      <select 
        name="role" 
        value={formData.role || ''} 
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez votre rôle</option>
        <option value="eleve">Étudiant</option>
        <option value="professeur">Enseignant</option>
      </select>
      <select 
        name="formation" 
        value={formData.formation || ''} 
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez votre formation</option>
        <option value="INFORMATIQUE">INFORMATIQUE</option>
        <option value="GÉNIE CIVIL">GÉNIE CIVIL</option>
        <option value="BIOTECHNOLOGIES">BIOTECHNOLOGIES</option>
        <option value="MÉCANIQUE">MÉCANIQUE</option>
        <option value="MATHÉMATIQUES APPLIQUÉES">MATHÉMATIQUES APPLIQUÉES</option>
      </select>
    </>
  )}

  <button type="submit">{isFormOpen === 'signup' ? 'Créer un compte' : 'Se connecter'}</button>

  <p>
    {isFormOpen === 'login' ? 'Pas encore inscrit ?' : 'Déjà un compte ?'}{' '}
    <button type="button" onClick={() => toggleForm(isFormOpen === 'login' ? 'signup' : 'login')} className="switch-form">
      {isFormOpen === 'login' ? 'Inscription' : 'Connexion'}
    </button>
  </p>

  <button type="button" onClick={() => setIsFormOpen(null)} className="close-btn">
    Fermer
  </button>
</form>

            </LoginFormContainer>
          </>
        )}

        <ToastContainer />
      </HeaderContainer>

      {/* Style de l'animation */}
      <style>{`
        @keyframes pulse { 0% {opacity:0.4;} 50% {opacity:0.7;} 100% {opacity:0.4;} }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>
  );
};

export default Header;
