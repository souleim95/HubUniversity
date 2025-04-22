import React, { useState, useEffect } from 'react';
import { RiEyeLine, RiEyeOffLine, RiArrowUpSLine, RiArrowDownSLine, 
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
  SearchContainer
} from '../styles/HeaderStyles';
import {
  FiltersContainer,
  ResultItem,
} from '../styles/SearchBoxStyles';
import hubCyLogo from '../assets/HubCyLogo.png';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';
import { equipments, categories, fakeObjects } from '../data/fakeData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from './Toast';
import Formation from './Formation';

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '', formation: '' });
  const [userName, setUserName] = useState(sessionStorage.getItem('user') || null);
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [userPoints, setUserPoints] = useState(parseInt(sessionStorage.getItem('points') || '0'));
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchWindowOpen, setIsSearchWindowOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const updatePointsFromStorage = () => {
      const stored = sessionStorage.getItem('points');
      const parsed = parseInt(stored, 10);
      setUserPoints(isNaN(parsed) ? 0 : parsed);
      setRole(sessionStorage.getItem('role'));
    };
  
    window.addEventListener('storage', updatePointsFromStorage);
    const intervalId = setInterval(updatePointsFromStorage, 200);
  
    return () => {
      window.removeEventListener('storage', updatePointsFromStorage);
      clearInterval(intervalId);
    };
  }, []); // tableau de dépendances vide : l'effet s'exécute qu'une seule fois
  

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //     clearInterval(interval);
  //   };
  // }, [userPoints, role]);
  //supprime les données lors de la fermeture de la page 

  const getRoleTitle = (roleKey) => {
    switch(roleKey) {
      case 'eleve': return 'Étudiant';
      case 'professeur': return 'Gestionnaire';
      case 'directeur': return 'Directeur';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = (roleKey) => {
    switch(roleKey) {
      case 'eleve': return '#4CAF50';
      case 'professeur': return '#2196F3';
      case 'directeur': return '#c62828';
      default: return '#757575';
    }
  };

  const toggleForm = (formType) => {
    setIsFormOpen(formType);
    setFormData({ name: '', email: '', role: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,  // Mise à jour du champ spécifique
    }));
  };

  const addToast = (text, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateForm = () => {
    const errors = [];

    if (isFormOpen === 'signup') {
      if (!formData.name.trim()) {
        errors.push('Le nom est obligatoire');
      } else if (formData.name.length < 3) {
        errors.push('Le nom doit contenir au moins 3 caractères');
      }
      if (!formData.role) {
        errors.push('Veuillez sélectionner votre rôle');
      }
    }

    if (!formData.email.trim()) {
      errors.push('L\'email est obligatoire');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Format d\'email invalide');
    }

    if (!formData.password) {
      errors.push('Le mot de passe est obligatoire');
    } else if (formData.password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (errors.length > 0) {
      errors.forEach(error => addToast(error, 'error'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    let requestData = isFormOpen === 'signup'
      ? { name: formData.name, email: formData.email, role: formData.role, password: formData.password }
      : { email: formData.email, password: formData.password };
  
    try {
      addToast(`Tentative de ${isFormOpen === 'signup' ? 'création de compte' : 'connexion'}...`, 'info');
      
      const url = isFormOpen === 'signup'
        ? 'http://localhost:5001/api/users'
        : 'http://localhost:5001/api/login';
  
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();

      if (response.ok) {
        if (isFormOpen === 'login') {
          sessionStorage.setItem('user', data.user.name);
          sessionStorage.setItem('role', data.user.role);
          sessionStorage.setItem('userId', data.user.id);
          sessionStorage.setItem('points', data.user.score);
          setUserName(data.user.name);
          setRole(data.user.role);
          setUserPoints(parseInt(data.user.score, 10));
          
          addToast(`Bienvenue ${data.user.name} ! Connexion réussie.`, 'success');
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          addToast('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
          setIsFormOpen('login');
          setFormData({ ...formData, name: '', role: '', password: '' });
        }
      } else {
        if (data.error.includes('exist')) {
          addToast('Cet email est déjà utilisé', 'error');
        } else if (data.error.includes('password')) {
          addToast('Mot de passe incorrect', 'error');
        } else if (data.error.includes('found')) {
          addToast('Aucun compte trouvé avec cet email', 'error');
        } else {
          addToast(data.error || 'Une erreur est survenue', 'error');
        }
      }
    } catch (error) {
      addToast('Erreur de connexion au serveur. Veuillez réessayer.', 'error');
    }
  };

  const handleLogout = () => {
    addToast(`Au revoir ${userName} ! À bientôt.`, 'info');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('points');
    setUserName(null);
    setRole(null);
    setUserPoints(0);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleSelectObject = (obj, categoryKey) => {
    // Réinitialiser les états de sélection
    setSelectedCategory(null);
    setSelectedRoom(null);
    setSelectedEquipment(null);
    // Fermer la fenêtre de recherche flottante
    setIsSearchWindowOpen(false);

    let targetCategory = categoryKey;
    let targetRoom = null;
    let targetEquipment = null;
  
    if (!targetCategory) {
      for (const [key, value] of Object.entries(categories)) {
        if (value.items && value.items.includes(obj.id)) {
          targetCategory = key;
          break;
        }
      }
    }
    
    if (obj.type === 'Salle') {
      targetRoom = obj.id;
    } else {
      targetEquipment = obj.id;
      for (const [roomId, roomEquips] of Object.entries(equipments)) {
        if (roomEquips.some(e => e.id === obj.id)) {
          targetRoom = roomId;
          break;
        }
      }
    }

    // Mettre à jour les états avec les nouvelles sélections
    
    setSelectedCategory(targetCategory);
    setSelectedRoom(targetRoom);
    setSelectedEquipment(targetEquipment);
  
    toast.info(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Navigation vers le tableau de bord
        </span>
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          {`${targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1)} › ${
            obj.type === 'Salle' ? obj.name : `${obj.name}`
          }`}
        </span>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        style: {
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderLeft: '4px solid #0f6ead',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }
      }
    );
  
    navigate('/dashboard', { 
      state: { 
        category: targetCategory, 
        room: targetRoom, 
        equipment: targetEquipment 
      } 
    });
  };

  const scrollToFaq = () => {
    // Si nous ne sommes pas sur la page d'accueil, naviguer d'abord vers celle-ci
    if (window.location.pathname !== '/') {
      navigate('/');
      // Attendre que la navigation soit terminée avant de faire défiler
      setTimeout(() => {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si nous sommes déjà sur la page d'accueil, simplement défiler
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToInfo = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const infoSection = document.getElementById('info-section');
        if (infoSection) {
          infoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const infoSection = document.getElementById('info-section');
      if (infoSection) {
        infoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToCampus = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const campusSection = document.getElementById('campus-section');
        if (campusSection) {
          campusSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const campusSection = document.getElementById('campus-section');
      if (campusSection) {
        campusSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleHeader = () => {
    setIsHeaderVisible(!isHeaderVisible);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Afficher la sidebar si la souris est à moins de 100px du bord gauche
      setIsSidebarVisible(e.clientX < 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderSidebarButton = (onClick, icon, title, color = '#f5f5f5') => (
    <div
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: color,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0f6ead';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = 'black';
      }}
      title={title}
    >
      {icon}
    </div>
  );

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    performSearch(text);
  };

  // Ajouter cette nouvelle fonction
  const performSearch = (text = searchText) => {
    try {
      const results = fakeObjects.filter(obj => {
        const textMatch = !text.trim() || 
          obj.name.toLowerCase().includes(text.toLowerCase()) || 
          obj.id.toLowerCase().includes(text.toLowerCase());
        
        const typeMatch = selectedType === 'all' || obj.type === selectedType;
        const statusMatch = selectedStatus === 'all' || obj.status === selectedStatus;
        
        let categoryMatch = selectedCategory === 'all';
        if (!categoryMatch && categories[selectedCategory]) {
          categoryMatch = categories[selectedCategory].items.includes(obj.id);
          
          if (!categoryMatch && obj.type !== 'Salle') {
            for (const [roomId, roomEquips] of Object.entries(equipments)) {
              if (categories[selectedCategory].items.includes(roomId) && 
                  roomEquips.some(equip => equip.id === obj.id)) {
                categoryMatch = true;
                break;
              }
            }
          }
        }
        
        return typeMatch && statusMatch && categoryMatch && (textMatch || !text.trim());
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    }
  };

  // Ajouter cet effet pour mettre à jour les résultats quand les filtres changent
  useEffect(() => {
    if (isSearchWindowOpen) {
      performSearch();
    }
  }, [selectedType, selectedStatus, selectedCategory, isSearchWindowOpen]);

  // Extraire les types et statuts uniques des objets (comme dans SearchBox)
  const objectTypes = [...new Set(fakeObjects.map(obj => obj.type))].sort();
  const statusTypes = [...new Set(fakeObjects.map(obj => obj.status))].sort();
  const sortedCategories = Object.entries(categories)
    .map(([key, value]) => ({ key, name: value.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchButtonClick = () => {
    // Fermer la recherche du header si elle est ouverte
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
    setIsSearchWindowOpen(!isSearchWindowOpen);
  };

  // Ajouter cette fonction useEffect pour gérer les clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchWindow = document.getElementById('search-window');
      const searchButton = document.getElementById('search-button');
      
      if (searchWindow && !searchWindow.contains(event.target) && 
          searchButton && !searchButton.contains(event.target)) {
        setIsSearchWindowOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          top: '55%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: 'white',
          padding: '15px 10px',
          borderRadius: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          transition: 'left 0.3s ease-in-out',
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

      <HeaderContainer style={{
        top: isHeaderVisible ? '0' : '-115px',
        transition: 'top 0.3s ease-in-out',
      }}>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
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
          />
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
              width: '350px',
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
                borderBottom: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="all">Tous les types</option>
                    {objectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="all">Tous les statuts</option>
                    {statusTypes.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="all">Toutes les catégories</option>
                    {sortedCategories.map(category => (
                      <option key={category.key} value={category.key}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Zone des résultats (scrollable) */}
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
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      border: '1px solid #eee',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#0f6ead';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#eee';
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      Type: {item.type} | Status: {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  {searchText ? 'Aucun résultat' : 'Commencez à taper pour rechercher'}
                </div>
              )}
            </div>

            {/* Barre de recherche fixée en bas */}
            <div style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              backgroundColor: 'white'
            }}>
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Rechercher par nom ou identifiant..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  outline: 'none'
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

        {/* Bouton de contrôle du header */}
        <div
          onClick={toggleHeader}
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
          {isHeaderVisible ? <RiArrowUpSLine size={24} color="white" /> : <RiArrowDownSLine size={24} color="white" />}
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
