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
  const isLoggedIn = !!sessionStorage.getItem('user');
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
    
    // 1. Construire l’objet updates uniquement avec les champs modifiés
    const updates = {};
    if (formData.pseudonyme !== initialFormData.pseudonyme)
      updates.pseudonyme = formData.pseudonyme;
    if (formData.genre !== initialFormData.genre)
      updates.genre = formData.genre;
    if (formData.dateNaissance !== initialFormData.dateNaissance)
      updates.dateNaissance = formData.dateNaissance;
    if (formData.nom !== initialFormData.nom)
      updates.nom = formData.nom;
    if (formData.prenom !== initialFormData.prenom)
      updates.prenom = formData.prenom;
    if (formData.email !== initialFormData.email)
      updates.email = formData.email;
    if (formData.formation !== initialFormData.formation)
      updates.formation = formData.formation;
    
    // 2. Gestion du mot de passe
    if (formData.newPassword || formData.confirmNewPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        toast.error('Veuillez renseigner votre ancien mot de passe');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error('Les nouveaux mots de passe ne correspondent pas');
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
        return;
      }
      updates.password = formData.newPassword; // le back hache automatiquement
    }
  
    // 3. S’il n’y a rien à mettre à jour, sortir
    if (Object.keys(updates).length === 0) {
      toast.info('Aucune modification détectée');
      return;
    }
  
    try {
      // 4. Appel PATCH
      const { data } = await axios.patch(
        `http://localhost:5001/api/users/${userId}`,
        updates,
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // data.user (ton back renvoie { message, user: { ... } })
      const updated = data.user;
  
      // 5. Mettre à jour le state et le localStorage
      setFormData(prev => ({
        ...prev,
        pseudonyme:   updated.pseudonyme,
        genre:        updated.genre,
        dateNaissance: updated.dateNaissance?.split('T')[0] || '',
        nom:          updated.nom,
        prenom:       updated.prenom,
        email:        updated.email,
        formation:    updated.formation
      }));
      // et pour le mot de passe on clear
      setFormData(fd => ({ ...fd, oldPassword: '', newPassword: '', confirmNewPassword: '' }));
  
      // localStorage
      localStorage.setItem('user', updated.pseudonyme);
      localStorage.setItem('genre', updated.genre);
      localStorage.setItem('dateNaissance', updated.dateNaissance);
      localStorage.setItem('nom', updated.nom);
      localStorage.setItem('prenom', updated.prenom);
      localStorage.setItem('email', updated.email);
      localStorage.setItem('formation', updated.formation);
  
      toast.success('Profil mis à jour avec succès');
      setIsModified(false);
    } catch (err) {
      console.error("Erreur mise à jour profil :", err);
      toast.error(err.response?.data?.error || 'Erreur serveur lors de la mise à jour');
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
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
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
              <InputField
                name="formation"
                placeholder="Formation"
                value={formData.formation}
                onChange={handleInputChange}
              />

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
