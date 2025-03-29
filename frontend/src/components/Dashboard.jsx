// src/components/Dashboard.jsx

import React, { useState } from 'react';
import { 
  DashboardContainer,
  ProfileCard,
  ObjectList,
  ObjectItem,
  LevelBox,
  ChangeLevelButton
} from '../styles/DashboardStyles';

import { fakeUser, fakeObjects } from '../data/fakeData';

const Dashboard = () => {
  const [user, setUser] = useState(fakeUser);

  const handleLevelChange = () => {
    if (user.points >= 3 && user.level === 'Débutant') {
      setUser({ ...user, level: 'Intermédiaire' });
    } else if (user.points >= 5 && user.level === 'Intermédiaire') {
      setUser({ ...user, level: 'Avancé' });
    } else if (user.points >= 7 && user.level === 'Avancé') {
      setUser({ ...user, level: 'Expert' });
    } else {
      alert('Pas assez de points pour changer de niveau');
    }
  };

  return (
    <DashboardContainer>
      <h2>Mon Tableau de Bord</h2>
      <ProfileCard>
        <h3>Profil</h3>
        <p><strong>Pseudo :</strong> {user.login}</p>
        <p><strong>Âge :</strong> {user.age}</p>
        <p><strong>Genre :</strong> {user.genre}</p>
        <p><strong>Niveau :</strong> {user.level}</p>
        <p><strong>Points :</strong> {user.points}</p>
        <LevelBox>Niveau actuel : {user.level}</LevelBox>
        <ChangeLevelButton onClick={handleLevelChange}>Changer de niveau</ChangeLevelButton>
      </ProfileCard>

      <ObjectList>
        <h3>Objets connectés</h3>
        {fakeObjects.map((obj) => (
          <ObjectItem key={obj.id}>
            <strong>{obj.name}</strong> ({obj.type}) - État : {obj.status}
          </ObjectItem>
        ))}
      </ObjectList>
    </DashboardContainer>
  );
};

export default Dashboard;
