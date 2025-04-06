import React, { useState, useEffect } from 'react';
import { 
  ProfileContainer, 
  Header, 
  InfoSection, 
  ProfileCard, 
  LevelBox, 
  ProgressBar, 
  InputField, 
  SaveButton, 
  ChangePasswordSection, 
  PasswordInputField 
} from '../styles/ProfileStyles';

const Profile = () => {
  const [userName, setUserName] = useState(localStorage.getItem('user'));
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [level, setLevel] = useState('Débutant');
  const [connections, setConnections] = useState(10); // simulation
  const [points, setPoints] = useState(120); // simulation
  const [formData, setFormData] = useState({
    name: userName,
    email: email,
    password: '',
    role: role,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [isModified, setIsModified] = useState(false); // New state to track changes

  useEffect(() => {
    setConnections(10);
    setPoints(120);
  }, []);

  useEffect(() => {
    const hasChanges = 
      formData.name !== userName ||
      formData.email !== email ||
      passwordData.oldPassword || 
      passwordData.newPassword ||
      passwordData.confirmNewPassword;

    setIsModified(hasChanges);
  }, [formData, passwordData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = () => {
    localStorage.setItem('user', formData.name);
    localStorage.setItem('email', formData.email);
    alert('Modifications enregistrées!');
    setIsModified(false);
  };

  return (
    <ProfileContainer>
      <Header>
        <h2>Mon Profil</h2>
        <p>Gérer vos informations personnelles et suivre votre progression</p>
      </Header>

      <InfoSection>
        <ProfileCard>
          <p><strong>Nom :</strong> <InputField type="text" name="name" value={formData.name} onChange={handleInputChange} /></p>
          <p><strong>Email :</strong> <InputField type="email" name="email" value={formData.email} onChange={handleInputChange} /></p>
        </ProfileCard>

        {/* Changer le mot de passe (section de saisie uniquement, pas de bouton) */}
        <ChangePasswordSection>
          <h3>Changer le mot de passe</h3>
          <PasswordInputField
            type="password"
            name="oldPassword"
            placeholder="Ancien mot de passe"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
          <PasswordInputField
            type="password"
            name="newPassword"
            placeholder="Nouveau mot de passe"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <PasswordInputField
            type="password"
            name="confirmNewPassword"
            placeholder="Confirmer le mot de passe"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
          />
        </ChangePasswordSection>

        <ProfileCard>
          <p><strong>Rôle :</strong> {role}</p>
          <p><strong>Connexions :</strong> {connections}</p>
          <p><strong>Points :</strong> {points}</p>
          
          <ProgressBar>
            <div style={{ width: `${(points / 200) * 100}%` }}></div>
          </ProgressBar>

          <LevelBox>
            <p>{level}</p>
          </LevelBox>
        </ProfileCard>
      </InfoSection>

      {/* Bouton Enregistrer les modifications */}
      <SaveButton className={isModified ? 'changed' : ''} onClick={handleSave}>Enregistrer les modifications</SaveButton>
    </ProfileContainer>
  );
};

export default Profile;
