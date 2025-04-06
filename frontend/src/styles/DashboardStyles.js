import styled from 'styled-components';

export const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 30px auto;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  background: linear-gradient(45deg, #6a82fb, #fc5c7d);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin: 0;
  }

  p {
    font-size: 1rem;
    margin: 10px 0;
  }
`;

export const InfoSection = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

export const ProfileCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: left;

  p {
    margin: 8px 0;
    font-size: 1rem;
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
`;

export const ProgressBar = styled.div`
  background-color: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  margin-top: 15px;
  width: 100%;
  
  div {
    background-color: #4caf50;
    height: 100%;
    border-radius: 10px;
  }
`;

export const ObjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  text-align: left;

  h3 {
    grid-column: span 2;
  }
`;

export const ObjectItem = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div`
  font-size: 2rem;
  margin-right: 15px;
  color: rgb(49, 137, 196);
`;
