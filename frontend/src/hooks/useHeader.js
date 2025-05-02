import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { equipments, categories, dataObjects } from '../data/projectData';

export const useHeaderState = () => {
  const [isFormOpen, setIsFormOpen] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
    password: '',
    formation: '',
    pseudonyme: '',
    dateNaissance: '',
    genre: ''
  });
  const [userName, setUserName] = useState(sessionStorage.getItem('user') || null);
  const isLoggedIn = !!sessionStorage.getItem('user');
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [userPoints, setUserPoints] = useState(parseInt(sessionStorage.getItem('points') || '0'));
  const [selectedCategory, setSelectedCategory] = useState('salles');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchWindowOpen, setIsSearchWindowOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const navigate = useNavigate();

  const getRoleTitle = (roleKey) => {
    switch (roleKey) {
      case 'eleve':
        return 'Étudiant';
      case 'professeur':
        return 'Gestionnaire';
      case 'directeur':
        return 'Directeur';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = (roleKey) => {
    switch (roleKey) {
      case 'eleve':
        return '#4CAF50';
      case 'professeur':
        return '#2196F3';
      case 'directeur':
        return '#c62828';
      default:
        return '#757575';
    }
  };

  const toggleForm = (formType) => {
    setIsFormOpen(formType);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      role: '',
      password: '',
      formation: '',
      pseudonyme: '',
      dateNaissance: '',
      genre: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const addToast = (text, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = () => {
    const errors = [];

    if (isFormOpen === 'signup') {
      if (!formData.nom.trim()) {
        errors.push('Le nom est obligatoire');
      } else if (formData.nom.length < 3) {
        errors.push('Le nom doit contenir au moins 3 caractères');
      }
      if (!formData.prenom.trim()) {
        errors.push('Le prénom est obligatoire');
      } else if (formData.prenom.length < 3) {
        errors.push('Le prénom doit contenir au moins 3 caractères');
      }
      if (!formData.role) {
        errors.push('Veuillez sélectionner votre rôle');
      }
      if (!formData.pseudonyme.trim()) {
        errors.push('Le pseudonyme est obligatoire');
      }
      if (!formData.formation.trim()) {
        errors.push('La formation est obligatoire');
      }
      if (!formData.dateNaissance.trim()) {
        errors.push('La date de naissance est obligatoire');
      }
    }
    if (!formData.email.trim()) {
      errors.push("L'email est obligatoire");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Format d'email invalide");
    }

    if (!formData.password) {
      errors.push('Le mot de passe est obligatoire');
    } else if (formData.password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (errors.length > 0) {
      errors.forEach((error) => addToast(error, 'error'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let requestData =
      isFormOpen === 'signup'
        ? {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            role: formData.role,
            password: formData.password,
            pseudonyme: formData.pseudonyme,
            formation: formData.formation,
            dateNaissance: formData.dateNaissance,
            genre: formData.genre
          }
        : { email: formData.email, password: formData.password };

    try {
      const url =
        isFormOpen === 'signup'
          ? 'http://localhost:5001/api/users'
          : 'http://localhost:5001/api/login';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isFormOpen === 'login') {
          // Stockage des données utilisateur
          sessionStorage.setItem('user', data.user.nom);
          sessionStorage.setItem('prenom', data.user.prenom);
          sessionStorage.setItem('role', data.user.role);
          sessionStorage.setItem('userId', data.user.id);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          sessionStorage.setItem('points', data.user.score);

          // Mise à jour des états
          setUserName(data.user.prenom || data.user.nom);
          setRole(data.user.role);
          setUserPoints(parseInt(data.user.score, 10));

          toast.success(`Bienvenue ${data.user.prenom} !`);

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          setIsFormOpen('login');
          setFormData({
            nom: '',
            prenom: '',
            email: '',
            role: '',
            password: '',
            pseudonyme: '',
            formation: '',
            dateNaissance: '',
            genre: ''
          });
        }
      } else {
        if (data.error.includes('exist')) {
          toast.error('Cet email est déjà utilisé');
        } else if (data.error.includes('password')) {
          toast.error('Mot de passe incorrect');
        } else if (data.error.includes('found')) {
          toast.error('Aucun compte trouvé avec cet email');
        } else {
          toast.error(data.error || 'Une erreur est survenue');
        }
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur. Veuillez réessayer.');
    }
  };

  const handleLogout = async () => {
    alert('👉 handleLogout déclenché');  
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser?.id) {
        alert(`🟢 userId=${currentUser.id} prêt pour l’API logout`);
        // Appel pour journaliser la déconnexion
        await axios.post('http://localhost:5001/api/logout', {
          userId: currentUser.id
        });
        alert('✅ API logout terminée avec succès');
      }     
    } catch (err) {
      console.error('🚨 Erreur journalisation logout :', err.response);
      alert(`🚨 Échec logout : ${err.response.status} – ${JSON.stringify(err.response.data)}`);
    }
    alert(`ℹ️ Avant toast et nettoyage session (userName=${userName})`);
    toast.info(`Au revoir ${userName} ! À bientôt.`); // message utilisateur
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('points');
    setUserName(null);
    setRole(null);
    setUserPoints(0);
    alert('⌛ Préparation reload de la page');
    setTimeout(() => {
      alert('🔄 reload de la page maintenant');
      window.location.reload();
    }, 300);
  };

  const handleSelectObject = (obj, categoryKey) => {
    // Réinitialiser les états de sélection
    setSelectedCategory(null);
    setSelectedRoom(null);
    setSelectedEquipment(null);
    // Fermer la fenêtre de recherche flottante
    setIsSearchWindowOpen(false);

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
        if (roomEquips.some((e) => e.id === obj.id)) {
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
        position: 'top-right',
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
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

  const scrollToFaq = () => {
    // Si nous ne sommes pas sur la page d'accueil, naviguer d'abord vers celle-ci
    if (window.location.pathname !== '/') {
      navigate('/');
      // Attendre que la navigation soit terminée avant de faire défiler
      setTimeout(() => {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si nous sommes déjà sur la page d'accueil, simplement défiler
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToInfo = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const infoSection = document.getElementById('info-section');
        if (infoSection) {
          infoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const infoSection = document.getElementById('info-section');
      if (infoSection) {
        infoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToCampus = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const campusSection = document.getElementById('campus-section');
        if (campusSection) {
          campusSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const campusSection = document.getElementById('campus-section');
      if (campusSection) {
        campusSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleHeader = () => {
    setIsHeaderVisible(!isHeaderVisible);
  };

  const renderSidebarButton = (onClick, icon, title, color = '#f5f5f5') => (
    <div
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: color,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0f6ead';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = 'black';
      }}
      title={title}
    >
      {icon}
    </div>
  );

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    performSearch(text);
  };

  const performSearch = useCallback(
    (text = searchText) => {
      try {
        let results = [];

        // Recherche dans les objets principaux
        const mainObjects = dataObjects.filter((obj) => {
          const textMatch =
            text.trim() === '' ||
            obj.name.toLowerCase().includes(text.toLowerCase()) ||
            obj.id.toLowerCase().includes(text.toLowerCase());

          const typeMatch = selectedType === 'all' || obj.type === selectedType;
          const statusMatch = selectedStatus === 'all' || obj.status === selectedStatus;
          let categoryMatch = selectedCategory === 'all';

          if (!categoryMatch && categories[selectedCategory]?.items) {
            categoryMatch = categories[selectedCategory].items.includes(obj.id);
          }

          return textMatch && typeMatch && statusMatch && categoryMatch;
        });

        results.push(...mainObjects);

        // Recherche dans les équipements de chaque salle
        Object.entries(equipments).forEach(([roomId, roomEquipments]) => {
          const roomEquipmentResults = roomEquipments.filter((equip) => {
            const textMatch =
              text.trim() === '' ||
              equip.name.toLowerCase().includes(text.toLowerCase()) ||
              equip.id.toLowerCase().includes(text.toLowerCase());

            const typeMatch = selectedType === 'all' || equip.type === selectedType;
            const statusMatch = selectedStatus === 'all' || equip.status === selectedStatus;
            let categoryMatch = selectedCategory === 'all';

            // Vérifier la catégorie de la salle parente
            if (!categoryMatch) {
              for (const [catKey, catValue] of Object.entries(categories)) {
                if (
                  catValue.items &&
                  (catValue.items.includes(roomId) || catValue.items.includes(equip.id))
                ) {
                  categoryMatch = catKey === selectedCategory;
                  break;
                }
              }
            }

            return textMatch && typeMatch && statusMatch && categoryMatch;
          });

          results.push(...roomEquipmentResults);
        });

        // Suppression des doublons par ID et tri
        results = [...new Map(results.map((item) => [item.id, item])).values()];
        results.sort((a, b) => {
          if (a.type === selectedType && b.type !== selectedType) return -1;
          if (a.type !== selectedType && b.type === selectedType) return 1;
          return a.name.localeCompare(b.name);
        });

        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      }
    },
    [searchText, selectedType, selectedStatus, selectedCategory]
  );

  const statusTypes = [...new Set(dataObjects.map((obj) => obj.status))].sort();
  const sortedCategories = Object.entries(categories)
    .map(([key, value]) => ({ key, name: value.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchButtonClick = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
    setIsSearchWindowOpen(!isSearchWindowOpen);
  };

  useEffect(() => {
    const updatePointsFromStorage = () => {
      const stored = sessionStorage.getItem('points');
      const parsed = parseInt(stored, 10);
      setUserPoints(isNaN(parsed) ? 0 : parsed);
      setUserName(sessionStorage.getItem('user'));
      setRole(sessionStorage.getItem('role'));
    };

    window.addEventListener('storage', updatePointsFromStorage);
    const intervalId = setInterval(updatePointsFromStorage, 1000);

    return () => {
      window.removeEventListener('storage', updatePointsFromStorage);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsSidebarVisible(e.clientX < 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isSearchWindowOpen) {
      performSearch();
    }
  }, [selectedType, selectedStatus, selectedCategory, isSearchWindowOpen, performSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchWindow = document.getElementById('search-window');
      const searchButton = document.getElementById('search-button');

      if (
        searchWindow &&
        !searchWindow.contains(event.target) &&
        searchButton &&
        !searchButton.contains(event.target)
      ) {
        setIsSearchWindowOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    handleLogout,
    handleSubmit,
    validateForm,
    handleSelectObject,
    getRoleTitle,
    getRoleColor,
    toggleForm,
    handleChange,
    addToast,
    removeToast,
    scrollToCampus,
    scrollToInfo,
    scrollToFaq,
    handleSearchButtonClick,
    renderSidebarButton,
    sortedCategories,
    handleSearch,
    statusTypes,
    performSearch,
    isFormOpen,
    setIsFormOpen,
    formData,
    setFormData,
    userName,
    setUserName,
    role,
    setRole,
    toggleHeader,
    userPoints,
    setUserPoints,
    selectedCategory,
    setSelectedCategory,
    selectedRoom,
    setSelectedRoom,
    selectedEquipment,
    setSelectedEquipment,
    showPassword,
    setShowPassword,
    toasts,
    setToasts,
    isHeaderVisible,
    setIsHeaderVisible,
    mousePosition,
    setMousePosition,
    isSidebarVisible,
    setIsSidebarVisible,
    isSearchOpen,
    setIsSearchOpen,
    isSearchWindowOpen,
    setIsSearchWindowOpen,
    showFilters,
    setShowFilters,
    searchText,
    setSearchText,
    searchResults,
    setSearchResults,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    navigate,
    isLoggedIn
  };
};
