import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Toast from './Toast';
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
  ProfilePictureContainer,
  ProfilePicture,
  DeleteButton,
  FileInputContainer,
  FileInputLabel,
  HiddenFileInput,
  FileNameDisplay,
  BackgroundContainer
} from '../styles/ProfileStyles';
import { FaLock, FaGlobe, FaTrashAlt, FaUser, FaCalendar, FaVenusMars } from 'react-icons/fa';
import profileBackground from '../assets/profil.png';

const Profile = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [age, setAge] = useState('');
  const [photoUrl, setPhotoUrl] = useState(localStorage.getItem('photoUrl') || null);
  const [toasts, setToasts] = useState([]);

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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    const storedPhotoUrl = localStorage.getItem('photoUrl');
    if (storedPhotoUrl) {
      setPhotoUrl(storedPhotoUrl);
    }
  }, []);

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
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          addToast('La taille de l\'image ne doit pas dépasser 5MB', 'error');
          return;
        }
        if (!file.type.startsWith('image/')) {
          addToast('Seules les images sont acceptées', 'error');
          return;
        }
        addToast('Photo de profil mise à jour', 'success');
      }
    }

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
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(formData.photo);
    }
  }, [formData.photo]);

  const handleDeletePhoto = () => {
    localStorage.removeItem('photoUrl');
    setPhotoUrl(null);
    setFormData((prevData) => ({
      ...prevData,
      photo: null,
    }));
    setIsModified(true);
    addToast('Photo de profil supprimée avec succès', 'info');
  };

  const addToast = (text, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSave = () => {
    if (formData.newPassword || formData.confirmNewPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        addToast('Veuillez renseigner votre ancien mot de passe pour effectuer la modification', 'error');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        addToast('Les nouveaux mots de passe ne correspondent pas', 'error');
        return;
      }
      if (formData.newPassword.length < 8) {
        addToast('Le nouveau mot de passe doit contenir au moins 8 caractères', 'error');
        return;
      }
      addToast('Votre mot de passe a été modifié avec succès', 'success');
    }

    const updates = [];
    if (formData.pseudonyme !== initialFormData.pseudonyme) {
      localStorage.setItem('user', formData.pseudonyme);
      updates.push('pseudonyme');
    }
    if (formData.genre !== initialFormData.genre) {
      localStorage.setItem('genre', formData.genre);
      updates.push('genre');
    }
    if (formData.dateNaissance !== initialFormData.dateNaissance) {
      localStorage.setItem('dateNaissance', formData.dateNaissance);
      updates.push('date de naissance');
    }
    if (formData.nom !== initialFormData.nom) {
      localStorage.setItem('nom', formData.nom);
      updates.push('nom');
    }
    if (formData.prenom !== initialFormData.prenom) {
      localStorage.setItem('prenom', formData.prenom);
      updates.push('prénom');
    }

    setIsModified(false);

    if (updates.length > 0) {
      addToast(
        `Modifications enregistrées : ${updates.join(', ')}`,
        'success'
      );
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  return (
    <>
      <Toast messages={toasts} removeToast={removeToast} />
      <BackgroundContainer>
        <img src={profileBackground} alt="Profile background" />
      </BackgroundContainer>
      <ProfileContainer>
        <Header>
          <h2>{isPublic ? 'Profil Public 🌐' : 'Profil Privé 🔒'}</h2>
          <ToggleViewButton onClick={toggleView}>
            {isPublic ? (
              <>
                Voir les infos privées <FaLock />
              </>
            ) : (
              <>
                Voir les infos publiques <FaGlobe />
              </>
            )}
          </ToggleViewButton>
        </Header>

        <InfoSection>
          {isPublic ? (
            <ProfileCard>
              <ProfilePictureContainer>
                {photoUrl && <ProfilePicture src={photoUrl} alt="Profile" />}
                <FileInputContainer>
                  <FileInputLabel htmlFor="photoInput">Choisir une photo</FileInputLabel>
                  <HiddenFileInput
                    id="photoInput"
                    name="photo"
                    type="file"
                    onChange={handleInputChange}
                  />
                  {formData.photo && <FileNameDisplay>{formData.photo.name}</FileNameDisplay>}
                </FileInputContainer>
                {photoUrl && (
                  <DeleteButton onClick={handleDeletePhoto}>
                    Supprimer la photo <FaTrashAlt />
                  </DeleteButton>
                )}
              </ProfilePictureContainer>
              <InputField
                name="pseudonyme"
                placeholder="Pseudonyme"
                value={formData.pseudonyme}
                onChange={handleInputChange}
                prefix={<FaUser />}
              />
              <InputField
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                prefix={<FaCalendar />}
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
                <option value="Homme">Homme <FaVenusMars /></option>
                <option value="Femme">Femme <FaVenusMars /></option>
              </select>

              <InputField name="typeMembre" value={formData.typeMembre} readOnly />
              
            </ProfileCard>
          ) : (
            <>
              <ProfileCard>
                <h3>Modifier vos identifiants</h3>
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
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Ancien mot de passe"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                />
                <ToggleViewButton type="button" onClick={toggleOldPasswordVisibility}>
                  {showOldPassword ? "Cacher" : "Afficher"}
                </ToggleViewButton>
                <PasswordInputField
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <ToggleViewButton type="button" onClick={toggleNewPasswordVisibility}>
                  {showNewPassword ? "Cacher" : "Afficher"}
                </ToggleViewButton>
                <PasswordInputField
                  name="confirmNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                />
                <ToggleViewButton type="button" onClick={toggleConfirmNewPasswordVisibility}>
                  {showConfirmNewPassword ? "Cacher" : "Afficher"}
                </ToggleViewButton>
              </ChangePasswordSection>
            </>
          )}
        </InfoSection>

        <SaveButton className={isModified ? 'changed' : ''} onClick={handleSave}>
          Enregistrer les modifications
        </SaveButton>
      </ProfileContainer>
    </>
  );
};

export default Profile;
