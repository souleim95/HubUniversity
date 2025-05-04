/*
 * Composant Profile : Gestion du profil utilisateur
 * 
 * Structure :
 * 1. États pour les données utilisateur
 * 2. Gestion des formulaires (infos perso, mot de passe)
 * 3. Système de toasts pour les notifications
 * 4. Gestion de la photo de profil
 * 
 * Fonctionnement :
 * - Stockage local des données utilisateur
 * - Validation des entrées utilisateur
 * - Upload et preview d'images
 * - Gestion des mots de passe avec masquage
 * - Notifications via système de toasts
 * - Double vue (publique/privée)
 * 
 * Sécurité :
 * - Vérification de connexion
 * - Validation des formats de fichiers
 * - Limites de taille pour les uploads
 * - Masquage sécurisé des mots de passe
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
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

/* 
* Composant principal du profil utilisateur
* Affiche les informations publiques et privées avec possibilité de modification et de changement de mot de passe
* Inclut un système de toasts pour le retour utilisateur
*/
const Profile = () => {
  // Vérification de l'authentification
  const isLoggedIn = !!sessionStorage.getItem('pseudo');
  const userId = sessionStorage.getItem('userId');
  // États pour la gestion du profil
  const [isPublic, setIsPublic] = useState(true);  // Vue publique/privée
  
  const [photoUrl, setPhotoUrl] = useState(localStorage.getItem('photoUrl') || null);
  const [toasts, setToasts] = useState([]);

  const [initialFormData, setInitialFormData] = useState({});
  const [formData, setFormData]       = useState({});
  const [isModified, setIsModified] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const verifyOldPassword = async () => {
    try {
      const { data } = await axios.get(`/api/users/${userId}/password`, {
        params: { oldPassword: formData.oldPassword }
      });
      return data.match; // true ou false
    } catch (err) {
      console.error('Erreur vérif oldPassword:', err);
      toast.error('Impossible de vérifier l’ancien mot de passe.');
      return false;
    }
  };

  const submitPasswordChange = async () => {
    try {
      const { data } = await axios.patch(`/api/users/${userId}/password`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      });
      toast.success(data.message || 'Mot de passe mis à jour !');
      // vider les champs
      setFormData(f => ({
        ...f,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur serveur lors du changement de mot de passe.';
      toast.error(msg);
      console.error('Erreur patch password:', err);
    }
  };

  // Charger le profil au montage
  useEffect(() => {
    if (!userId) return;
  
    axios.get(`http://localhost:5001/api/users/${userId}`)
      .then(({ data }) => {
        const loadedData = {
          pseudonyme: data.pseudonyme || '',
          genre: data.genre || '',
          dateNaissance: data.dateNaissance?.split('T')[0] || '',
          formation: data.formation || '',
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          photo: null
        };
  
        setFormData(loadedData);
        setInitialFormData(loadedData);  // mettre à jour le point de comparaison
      })
      .catch(err => {
        console.error("Erreur chargement profil:", err);
        toast.error("Impossible de charger le profil");
      });
  }, [userId]);
  

  // Effets pour la gestion des données
  useEffect(() => {
    // Chargement de la photo
    const storedPhotoUrl = localStorage.getItem('photoUrl');
    if (storedPhotoUrl) {
      setPhotoUrl(storedPhotoUrl);
    }
  }, []);

  

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(initialFormData));
  }, [formData, initialFormData]);

  const toggleView = () => setIsPublic(!isPublic);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Gestion spécifique du champ "photo" : vérification de la taille et du type de fichier
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error('La taille de l\'image ne doit pas dépasser 5MB');
          return;
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Seules les images sont acceptées');
          return;
        }
        toast.success('Photo de profil mise à jour');
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Si une nouvelle photo a été uploadée, on la convertit en base64 pour l'affichage immédiat et la sauvegarde locale
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
    toast.info('Photo de profil supprimée avec succès');
  };

  const handleSave = async () => {
    if (!userId) return;
    const wantsApply = window.confirm("Voulez-vous appliquer ces modifications ?");
    if (!wantsApply) return;

    // 1) Construire l’objet profileUpdates
    const profileUpdates = {};
    ['nom', 'prenom', 'email', 'pseudonyme', 'genre', 'formation', 'dateNaissance']
      .forEach(key => {
        if (formData[key] !== initialFormData[key]) {
          profileUpdates[key] = formData[key];
        }
      });

    // 2) Préparer le flag de changement de mot de passe
    const wantsPasswordChange = 
      formData.oldPassword || formData.newPassword || formData.confirmNewPassword;

    // 3) Validation locale
    if (wantsPasswordChange) {
      if (!formData.oldPassword) {
        toast.error('Veuillez renseigner votre ancien mot de passe.');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error('Les nouveaux mots de passe ne correspondent pas.');
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error('Le mot de passe doit faire au moins 8 caractères.');
        return;
      }

      // 4) Vérification de l’ancien mot de passe
      const ok = await verifyOldPassword();
      if (!ok) {
        toast.error('Ancien mot de passe incorrect.');
        return;
      }

      // 5) Envoi du nouveau mot de passe
      try {
        const { data } = await axios.patch(
          `/api/users/${userId}/password`,
          {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmNewPassword: formData.confirmNewPassword
          }
        );
        toast.success(data.message || 'Mot de passe mis à jour.', { containerId: 'profile-toast' });
        // On vide les champs liés au mot de passe
        setFormData(f => ({
          ...f,
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      } catch (err) {
        const msg = err.response?.data?.error || 'Erreur lors du changement de mot de passe.';
        console.error(err);
        toast.error(msg, { containerId: 'profile-toast' });
        return;
      }
    }

    // 6) Mise à jour du profil si nécessaire
    if (Object.keys(profileUpdates).length > 0) {
      try {
        const { data } = await axios.patch(`/api/users/${userId}`, profileUpdates);
        const updated = data.user;
        // Met à jour le state
        setFormData(f => ({
          ...f,
          nom:           updated.nom,
          prenom:        updated.prenom,
          email:         updated.email,
          pseudonyme:    updated.pseudonyme,
          genre:         updated.genre,
          formation:     updated.formation,
          dateNaissance: updated.dateNaissance?.split('T')[0] || ''
        }));
        // Réinitialise la baseline
        setInitialFormData(prev => ({ ...prev, ...profileUpdates }));
        toast.success(data.message || 'Profil mis à jour.', { containerId: 'profile-toast' });
      } catch (err) {
        const msg = err.response?.data?.error || 'Erreur lors de la mise à jour du profil.';
        console.error(err);
        toast.error(msg, { containerId: 'profile-toast' });
        return;
      }
    }

    // 7) Fin du process
    setIsModified(false);
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

  // exemple de conversion JS vers YYYY-MM-DD :
  const formatDateToInput = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    // Format en YYYY-MM-DD
    return date.toISOString().slice(0, 10);
  };

  if (!isLoggedIn) {
    //renvoie vers la page d'acceuil
    return <Navigate to="/" replace />;
  }
  if (!formData || Object.keys(formData).length === 0) {
    return <p style={{ color: 'white' }}>Chargement du profil...</p>;
  }
  console.log("Valeur envoyée au champ date :", formData.dateNaissance, formatDateToInput(formData.dateNaissance));

  return (
    <>
      {/* Système de notifications */}
      <ToastContainer
        containerId="profile-toast"   // <-- ici ton ID unique
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Interface du profil */}
      <BackgroundContainer>
        <img src={profileBackground} alt="Profile background" />
      </BackgroundContainer>
      <div style={{ paddingTop: '130px' }}></div>
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
      

              <InputField
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleInputChange}
              />
              <InputField
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleInputChange}
              />
              <InputField
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
<select
  name="formation"
  value={formData.formation}
  onChange={handleInputChange}
  style={{
    padding: '18px',
    margin: '20px 0',
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #e1e1e1',
    backgroundColor: '#1d124e',
    color: 'white',
    fontSize: '1.2rem',
  }}
>
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
  <option value="Mathématique">Master Mathématiques</option>
  <option value="Informatique">Master Informatique</option>
</select>
              

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
                <option value="Autre">Autre <FaVenusMars /></option>
              </select>

              <InputField 
                name="typeMembre" 
                value={formData.typeMembre} 
                readOnly 
              />
              
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
