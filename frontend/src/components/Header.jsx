import React, { useState, useEffect } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton,
  LoginFormContainer, 
  Overlay,
  SearchContainer
} from '../styles/HeaderStyles';
import hubCyLogo from '../assets/HubCyLogo.png';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';
import { equipments } from '../data/fakeData';
import { categories } from '../data/fakeData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from './Toast';

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });
  const [userName, setUserName] = useState(sessionStorage.getItem('user') || null);
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [userPoints, setUserPoints] = useState(parseInt(sessionStorage.getItem('points') || '0'));
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mouseAtTop, setMouseAtTop] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up');
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    const handleMouseMove = (e) => {
      setMouseAtTop(e.clientY < 150);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollTop]);

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
    setFormData({ ...formData, [name]: value });
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

  return (
    <HeaderContainer style={{
      top: (scrollDirection === 'up' || mouseAtTop) ? '0' : '-115px',
      transition: 'top 0.3s'
    }}>
      <Toast messages={toasts} removeToast={removeToast} />
      <WelcomeChoices>
        <a href="/">
          <img src={hubCyLogo} alt="HubCY" />
        </a>
      </WelcomeChoices>

      <NavLinks>
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
            <span style={{ 
              fontWeight: 'bold', 
              marginRight: '10px'
            }}>
              Bonjour {userName}
            </span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
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
      </NavLinks>

      <SearchContainer>
        <SearchBox 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedRoom={setSelectedRoom}
          setSelectedEquipment={setSelectedEquipment}
          onSelectObject={handleSelectObject}
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
              
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              
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

              {isFormOpen === 'signup' && (
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Sélectionnez votre rôle</option>
                  <option value="eleve">Étudiant</option>
                  <option value="professeur">Enseignant</option>
                </select>
              )}

              <button type="submit">
                {isFormOpen === 'signup' ? 'Créer un compte' : 'Se connecter'}
              </button>

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

              <button type="button" onClick={() => setIsFormOpen(null)} className="close-btn">
                Fermer
              </button>
            </form>
          </LoginFormContainer>
        </>
      )}
      <ToastContainer />
    </HeaderContainer>
  );
};

export default Header;
