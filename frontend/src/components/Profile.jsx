import React, { useState, useEffect } from 'react';
import {
  ProfileContainer,
  Header,
  InfoSection,
  ProfileCard,
  InputField,
  SaveButton,
  ChangePasswordSection,
  PasswordInputField,
  ToggleViewButton,
} from '../styles/ProfileStyles';

const Profile = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [age, setAge] = useState('');

  const initialFormData = {
    pseudonyme: localStorage.getItem('user') || '',
    genre: localStorage.getItem('genre') || '',
    dateNaissance: localStorage.getItem('dateNaissance') || '',
    typeMembre: localStorage.getItem('role') || '',
    photo: null,
    nom: localStorage.getItem('nom') || '',
    prenom: localStorage.getItem('prenom') || '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (formData.dateNaissance) {
      const birthDate = new Date(formData.dateNaissance);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [formData.dateNaissance]);

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(initialFormData));
  }, [formData]);

  const toggleView = () => setIsPublic(!isPublic);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  useEffect(() => {
    if (formData.photo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('photoUrl', reader.result);
      };
      reader.readAsDataURL(formData.photo);
    }
  }, [formData.photo]);
  

  const handleSave = () => {
    if (formData.newPassword || formData.confirmNewPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        alert('Veuillez entrer votre ancien mot de passe.');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        alert('La confirmation du mot de passe ne correspond pas.');
        return;
      }
      alert('Mot de passe modifié avec succès.');
    }

    localStorage.setItem('user', formData.pseudonyme);
    localStorage.setItem('genre', formData.genre);
    localStorage.setItem('dateNaissance', formData.dateNaissance);
    localStorage.setItem('nom', formData.nom);
    localStorage.setItem('prenom', formData.prenom);

    setIsModified(false);
    alert('Modifications enregistrées !');
  };

  return (
    <ProfileContainer>
      <Header>
        <h2>{isPublic ? 'Profil Public 🌐' : 'Profil Privé 🔒'}</h2>
        <ToggleViewButton onClick={toggleView}>
          {isPublic ? 'Voir les infos privées 🔒' : 'Voir les infos publiques 🌐'}
        </ToggleViewButton>
      </Header>

      <InfoSection>
        {isPublic ? (
          <ProfileCard>
            <InputField
              name="pseudonyme"
              placeholder="Pseudonyme"
              value={formData.pseudonyme}
              onChange={handleInputChange}
            />
            <InputField
              name="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={handleInputChange}
            />
            <InputField name="age" placeholder="Âge" type="number" value={age} readOnly />

            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              style={{
                padding: '18px',
                margin: '20px 0',
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #e1e1e1',
                fontSize: '1.2rem',
              }}
            >
              <option value="">Sélectionner un genre</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>

            <InputField name="typeMembre" value={formData.typeMembre} readOnly />
            
            <label style={{ margin: '10px 0', fontSize: '1.1rem' }}>
              Photo de profil :
              <InputField name="photo" type="file" onChange={handleInputChange} />
            </label>
          </ProfileCard>
        ) : (
          <>
            <ProfileCard>
              <InputField
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleInputChange}
              />
              <InputField
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleInputChange}
              />
            </ProfileCard>

            <ChangePasswordSection>
              <h3>Modifier le mot de passe</h3>
              <PasswordInputField
                name="oldPassword"
                type="password"
                placeholder="Ancien mot de passe"
                value={formData.oldPassword}
                onChange={handleInputChange}
              />
              <PasswordInputField
                name="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              <PasswordInputField
                name="confirmNewPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
              />
            </ChangePasswordSection>
          </>
        )}
      </InfoSection>

      <SaveButton className={isModified ? 'changed' : ''} onClick={handleSave}>
        Enregistrer les modifications
      </SaveButton>
    </ProfileContainer>
  );
};

export default Profile;
