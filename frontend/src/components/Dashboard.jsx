import React, { useState } from 'react';
import { 
  DashboardContainer,
  ProfileCard,
  ObjectList,
  ObjectItem,
  LevelBox,
  ChangeLevelButton,
  ProgressBar,
  IconWrapper,
  Header,
  InfoSection,
  ObjectGrid
} from '../styles/DashboardStyles';

import { fakeUser, fakeObjects } from '../data/fakeData';
import { FaWifi, FaFan, FaTv } from 'react-icons/fa'; 

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
      <Header>
        <h2>Mon Tableau de Bord</h2>
        <p>Suivez votre progression et gérez vos objets connectés</p>
      </Header>
      <InfoSection>
        <ProfileCard>
          <h3>Profil</h3>
          <p><strong>Pseudo :</strong> {user.login}</p>
          <p><strong>Âge :</strong> {user.age}</p>
          <p><strong>Genre :</strong> {user.genre}</p>
          <p><strong>Niveau :</strong> {user.level}</p>
          <p><strong>Points :</strong> {user.points}</p>
          
          <ProgressBar>
            <div style={{ width: `${(user.points / 10) * 100}%` }} />
          </ProgressBar>

          <LevelBox>Niveau actuel : {user.level}</LevelBox>
          <ChangeLevelButton onClick={handleLevelChange}>Changer de niveau</ChangeLevelButton>
        </ProfileCard>
      </InfoSection>

      <ObjectGrid>
        <h3>Objets connectés</h3>
        {fakeObjects.map((obj) => (
          <ObjectItem key={obj.id}>
            <IconWrapper>
              {obj.type === 'Wifi' && <FaWifi />}
              {obj.type === 'Ventilateur' && <FaFan />}
              {obj.type === 'Télévision' && <FaTv />}
            </IconWrapper>
            <div>
              <strong>{obj.name}</strong> - État : {obj.status}
            </div>
          </ObjectItem>
        ))}
      </ObjectGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
