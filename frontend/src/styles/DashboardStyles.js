import styled from 'styled-components';

export const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  width: 95%;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const ProfileCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  p {
    margin: 10px 0;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const LevelBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(15, 110, 173);
  color: white;
  border-radius: 5px;
`;

export const ChangeLevelButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: rgb(49, 137, 196);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: rgb(67, 143, 228);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

export const ObjectList = styled.div`
  text-align: left;
`;

export const ObjectItem = styled.div`
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
