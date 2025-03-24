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
import SearchBox from './SearchBox';

const Header = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });

  const toggleForm = (formType) => {
    setIsFormOpen(isFormOpen === formType ? null : formType);
    setFormData({ name: '', email: '', role: '', password: '' }); // Réinitialisation du formulaire
  };

  const handleChange = (e) => {
    setFormData({ ...formData, 
      [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Déterminer les données à envoyer
    let requestData;
    if (isFormOpen === 'signup') {
      requestData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
    } else {
      requestData = {
        email: formData.email,
        password: formData.password
      };
    }
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
        alert(isFormOpen === 'signup' ? 'Inscription réussie !' : `Bienvenue ${data.name} !`);
        
        if (isFormOpen === 'login') {
          localStorage.setItem('user', JSON.stringify(data.name));
          window.location.reload(); // Rafraîchir la page pour mettre à jour le header
        }

        toggleForm(null); // Fermer le formulaire après succès
      } else {
        alert('Erreur lors de l\'opération.', response.status);
        console.log(response.statusText);
      }
    } catch (error) {
      alert('Erreur réseau. Vérifiez votre connexion.');
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

      {(isFormOpen === 'signup' || isFormOpen === 'login') && (
        <>
          <Overlay onClick={() => toggleForm(null)} />
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
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Sélectionnez votre rôle</option>
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                </select>
              )}

              <button type="submit">{isFormOpen === 'signup' ? 'Créer un compte' : 'Se connecter'}</button>
              <button type="button" onClick={() => toggleForm(null)} className="close-btn">Fermer</button>
            </form>
          </LoginFormContainer>
        </>
      )}
    </HeaderContainer>
  );
};

export default Header;
