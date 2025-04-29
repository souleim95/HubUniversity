import styled from 'styled-components';

export const InfoContainer = styled.div`
  margin: 20px auto;
  padding: 25px;
  max-width: 1400px;
  width: 102.5%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const InfoTitle = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h2 {
    color: #1a202c;
    font-size: 2.5em;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.02em;
  }
`;

export const InfoContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const TrainBox = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
`;
