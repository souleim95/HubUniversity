import React, { useState, useEffect } from 'react';
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

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });
  const [userName, setUserName] = useState(localStorage.getItem('user') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [userPoints, setUserPoints] = useState(parseInt(localStorage.getItem('points') || '0'));
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserPoints(parseInt(localStorage.getItem('points') || '0'));
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const storedPoints = parseInt(localStorage.getItem('points') || '0');
      const storedRole = localStorage.getItem('role');
      
      if (storedPoints !== userPoints) {
        setUserPoints(storedPoints);
      }
      
      if (storedRole !== role) {
        setRole(storedRole);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userPoints, role]);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let requestData = isFormOpen === 'signup'
      ? { name: formData.name, email: formData.email, role: formData.role, password: formData.password }
      : { email: formData.email, password: formData.password };

    const url = isFormOpen === 'signup'
      ? 'http://localhost:5001/api/users'
      : 'http://localhost:5001/api/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();

        if (isFormOpen === 'login') {
          localStorage.setItem('user', data.user.name);
          localStorage.setItem('role', data.user.role);
          localStorage.setItem('points', '0');
          setUserName(data.user.name);
          setRole(data.user.role);
          setUserPoints(0);
          window.location.reload();
        }

        setIsFormOpen(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de la connexion.');
      }
    } catch (error) {
      alert('Erreur réseau. Vérifiez votre connexion.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('points');
    setUserName(null);
    setRole(null);
    setUserPoints(0);
    window.location.reload();
  };

  const handleSelectObject = (obj, categoryKey) => {
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
    
    console.log(`Navigation vers Dashboard - Catégorie: ${targetCategory}, Salle: ${targetRoom}, Équipement: ${targetEquipment}`);

    navigate('/dashboard', { 
      state: { 
        category: targetCategory, 
        room: targetRoom, 
        equipment: targetEquipment 
      } 
    });
  };

  return (
    <HeaderContainer>
      <WelcomeChoices>
        <a href="/">
          <img src={hubCyLogo} alt="HubCY" />
        </a>
      </WelcomeChoices>

      <NavLinks>
        <div>
          {userName && (
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
          )}
          {!userName && (
            <ConnectButton onClick={() => toggleForm('login')}>Connexion</ConnectButton>
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
                <input type="text" name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} required />
              )}
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              
              {isFormOpen === 'login' && (
                <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
              )}

              {isFormOpen === 'signup' && (
                <>
                  <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Sélectionnez votre rôle</option>
                    <option value="eleve">Étudiant</option>
                    <option value="professeur">Enseignant</option>
                    <option value="directeur">Administrateur</option>
                  </select>
                </>
              )}

              <button type="submit">{isFormOpen === 'signup' ? 'Créer un compte' : 'Se connecter'}</button>

              {isFormOpen === 'login' ? (
                <p>
                  Pas encore inscrit ?{' '}
                  <button type="button" onClick={() => toggleForm('signup')} className="switch-form">
                    Inscription
                  </button>
                </p>
              ) : (
                <p>
                  Déjà un compte ?{' '}
                  <button type="button" onClick={() => toggleForm('login')} className="switch-form">
                    Connexion
                  </button>
                </p>
              )}

              <button type="button" onClick={() => setIsFormOpen(null)} className="close-btn">
                Fermer
              </button>
            </form>
          </LoginFormContainer>
        </>
      )}
    </HeaderContainer>
  );
};

export default Header;
