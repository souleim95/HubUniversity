import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const navigate = useNavigate();

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
        alert(isFormOpen === 'signup' ? 'Inscription réussie !' : `Bonjour ${data.user.name} !`);

        if (isFormOpen === 'login') {
          localStorage.setItem('user', data.user.name);
          localStorage.setItem('role', data.user.role);
          setUserName(data.user.name);
          setRole(data.user.role);
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
    setUserName(null);
    setRole(null);
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
            <span>Bonjour {userName}</span>
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
