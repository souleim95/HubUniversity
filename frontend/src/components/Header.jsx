import React, { useState } from 'react';
import { 
  HeaderContainer, 
  WelcomeChoices, 
  NavLinks,
  ConnectButton,
  LoginFormContainer, 
  Overlay 
} from '../styles/HeaderStyles';
import hubCyLogo from '../assets/HubCyLogo.png';
import SearchBox from './SearchBox'; // Importation du composant SearchBox

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); 
  const [formData, setFormData] = useState({ fullName: '', email: '', role: '' });

  const toggleForm = (formType) => {
    setIsFormOpen(isFormOpen === formType ? null : formType);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Envoi des données:', formData); // DEBUG

    try {
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Utilisateur créé :', user);
        alert('Inscription réussie !');
        toggleForm(null); // Fermer le formulaire après inscription réussie
      } else {
        console.error('Erreur lors de l\'inscription :', response.statusText);
        alert('Erreur lors de l\'inscription.');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Erreur réseau. Veuillez vérifier votre connexion.');
    }
  };

  return (
    <HeaderContainer>
      <WelcomeChoices>
        <a href="/">
          <img src={hubCyLogo} alt="HubCY" />
        </a>
      </WelcomeChoices>

      <NavLinks>
        <a href="/faq">FAQ</a>
        <div>
          <ConnectButton onClick={() => toggleForm('login')}>Connexion</ConnectButton>
          <ConnectButton onClick={() => toggleForm('signup')}>Inscription</ConnectButton>
        </div>
      </NavLinks>

      <SearchBox />

      {isFormOpen === 'signup' && (
        <>
          <Overlay onClick={() => toggleForm(null)} />
          <LoginFormContainer>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="fullName" placeholder="Nom complet" value={formData.fullName} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email académique" value={formData.email} onChange={handleChange} required />
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Sélectionnez votre rôle</option>
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
              </select>
              <button type="submit">Créer un compte</button>
              <button onClick={() => toggleForm(null)} className="close-btn">Fermer</button>
            </form>
          </LoginFormContainer>
        </>
      )}
    </HeaderContainer>
  );
};

export default Header;
