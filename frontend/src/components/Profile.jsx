import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
`;

const InfoItem = styled.div`
  margin: 15px 0;
  font-size: 1.1rem;
`;

const LevelButton = styled.button`
  background-color: rgb(15, 110, 173);
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const InputField = styled.input`
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

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

  useEffect(() => {
    setConnections(10);
    setPoints(120);
  }, []);

  const handleChangeLevel = () => {
    const currentIndex = levels.indexOf(level);
    const nextIndex = (currentIndex + 1) % levels.length;
    setLevel(levels[nextIndex]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    localStorage.setItem('user', formData.name);
    localStorage.setItem('email', formData.email);
    alert('Modifications enregistrées!');
  };

  return (
    <ProfileContainer>
      <h2>Mon Profil</h2>
      <InfoItem><strong>Nom :</strong> <InputField type="text" name="name" value={formData.name} onChange={handleInputChange} /></InfoItem>
      <InfoItem><strong>Email :</strong> <InputField type="email" name="email" value={formData.email} onChange={handleInputChange} /></InfoItem>
      <InfoItem><strong>Rôle :</strong> {role}</InfoItem>
      <InfoItem><strong>Niveau :</strong> {level}</InfoItem>
      <InfoItem><strong>Connexions :</strong> {connections}</InfoItem>
      <InfoItem><strong>Points :</strong> {points}</InfoItem>

      <LevelButton onClick={handleChangeLevel}>Changer de niveau</LevelButton>

      <div>
        <h3>Modifier votre mot de passe :</h3>
        <InputField type="password" name="password" placeholder="Nouveau mot de passe" onChange={handleInputChange} />
      </div>

      <LevelButton onClick={handleSave}>Enregistrer les modifications</LevelButton>
    </ProfileContainer>
  );
};

export default Profile;
